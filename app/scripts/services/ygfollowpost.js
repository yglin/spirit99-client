'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygFollowPost
 * @description
 * # ygFollowPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygFollowPost', ['$rootScope', 'uiGmapGoogleMapApi', 'ygServer', 'ygUserPref',
function ($rootScope, uiGmapGoogleMapApi, ygServer, ygUserPref) {
    var self = this;

    self.serverSupportFollowPost = false;
    self.followPostBy = [];
    self.followedPosts = {};

    ygServer.initialPromises['updateServers'].then(function () {
        self.serverSupportFollowPost = !angular.isUndefined(ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy) && ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy != null;
        if(self.serverSupportFollowPost){
            self.followPostBy = ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy;            
            if(angular.isUndefined(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer])){
                ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer] = {};
            }
            self.followedPosts = ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer];
            // console.log(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer]);
        }

        $rootScope.$watch(function () {
            return ygUserPref.$storage.selectedServer;
        }, function (newValue) {
            self.serverSupportFollowPost = !angular.isUndefined(ygServer.servers[newValue].followPostBy) && ygServer.servers[newValue].followPostBy != null;        
            if(self.serverSupportFollowPost){
                self.followPostBy = ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy;            
                if(angular.isUndefined(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer])){
                    ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer] = {};
                }
                self.followedPosts = ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer];
                // console.log(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer]);
            }
        });
    });

    self.isFollowingPost = function (post) {
        if(!self.serverSupportFollowPost){
            return false;
        }
        return post.id in self.followedPosts;
    };

    self.followPost = function (post) {
        if(!self.serverSupportFollowPost){
            return false;
        }
        if(!(post.id in self.followedPosts)){
            // console.log(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer]);
            self.followedPosts[post.id] = {};
        }
    };

    self.unfollowPost = function (post) {
        if(!self.serverSupportFollowPost){
            return false;
        }
        if(post.id in self.followedPosts){
            delete self.followedPosts[post.id];
        }        
    };

    self.checkPost = function (post) {
        if(!self.serverSupportFollowPost){
            return false;
        }
        if(!(post.id in self.followedPosts)){
            self.followedPosts[post.id] = {};
        }
        if(self.followPostBy.indexOf('modify_time') > -1){
            self.followedPosts[post.id]['lastCheckTime'] = new Date();
        }
    };

    self.isSomethingNew = function (post) {
        if(!self.serverSupportFollowPost){
            return false;
        }
        if(self.followPostBy.indexOf('modify_time') > -1
        && 'modify_time' in post
        && 'lastCheckTime' in self.followedPosts[post.id]){
            var modify_time = new Date(post.modify_time);
            var lastCheckTime = new Date(self.followedPosts[post.id].lastCheckTime);
            if(lastCheckTime  < modify_time){
                return true;
            }
        }
        return false;
    };

    self.addNotification = function (post) {};
    self.removeNotification = function (post) {};

    uiGmapGoogleMapApi.then(function (googlemaps) {
        self.addNotification = function (post) {
            post.options = typeof post.options === 'undefined' ? {} : post.options;
            post.options.animation = googlemaps.Animation.BOUNCE;
        };

        self.removeNotification = function (post) {
            if(post.options && post.options.animation){
                post.options.animation = null;
            }
        };
    });
}]);
