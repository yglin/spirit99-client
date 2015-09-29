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

    self.supportFollowPost = false;
    self.followPostBy = [];
    self.followedPosts = {};

    self.switchServer = function (server) {
        self.followPostBy = server.followPostBy;
        if(angular.isUndefined(ygUserPref.$storage.followedPosts[server.name])){
            ygUserPref.$storage.followedPosts[server.name] = {};
        }
        self.followedPosts = ygUserPref.$storage.followedPosts[server.name];
    };

    ygServer.initialPromises.updateServers.then(function () {
        self.supportFollowPost = ygServer.getSupportFollowPost();
        if(self.supportFollowPost){
            self.switchServer(ygServer.selectedServer);
        }

        $rootScope.$watch(function () {
            return ygServer.selectedServer;
        }, function (newValue) {
            self.supportFollowPost = ygServer.getSupportFollowPost();
            if(self.supportFollowPost){
                self.switchServer(ygServer.selectedServer);
            }
        });
    });

    self.isFollowingPost = function (post) {
        if(!self.supportFollowPost){
            return false;
        }
        return post.id in self.followedPosts;
    };

    self.followPost = function (post) {
        if(!self.supportFollowPost){
            return false;
        }
        if(!(post.id in self.followedPosts)){
            self.followedPosts[post.id] = {};
        }
    };

    self.unfollowPost = function (post) {
        if(!self.supportFollowPost){
            return false;
        }
        if(post.id in self.followedPosts){
            delete self.followedPosts[post.id];
        }        
    };

    self.checkPost = function (post) {
        if(!self.supportFollowPost){
            return false;
        }
        if(!(post.id in self.followedPosts)){
            self.followedPosts[post.id] = {};
        }
        if(self.followPostBy.indexOf('modify_time') > -1){
            self.followedPosts[post.id].lastCheckTime = new Date();
        }
    };

    self.isSomethingNew = function (post) {
        if(!self.supportFollowPost){
            return false;
        }
        if(self.followPostBy.indexOf('modify_time') > -1 &&
        'modify_time' in post &&
        'lastCheckTime' in self.followedPosts[post.id]){
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
