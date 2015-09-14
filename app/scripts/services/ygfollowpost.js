'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygFollowPost
 * @description
 * # ygFollowPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygFollowPost', ['$rootScope', 'ygServer', 'ygUserPref',
function ($rootScope, ygServer, ygUserPref) {
    var self = this;

    self.serverSupportFollowPost = false;
    self.followPostBy = [];
    self.followedPosts = {};

    ygServer.initialPromises['updateServers'].then(function () {
        self.serverSupportFollowPost = !angular.isUndefined(ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy) && ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy != null;
        if(self.serverSupportFollowPost){
            self.followPostBy = ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy;            
        }
        if(self.serverSupportFollowPost
        && angular.isUndefined(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer])){
            ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer] = {};
            self.followedPosts = ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer];
        }

        $rootScope.$watch(function () {
            return ygUserPref.$storage.selectedServer;
        }, function (newValue) {
            self.serverSupportFollowPost = !angular.isUndefined(ygServer.servers[newValue].followPostBy) && ygServer.servers[newValue].followPostBy != null;        
            if(self.serverSupportFollowPost){
                self.followPostBy = ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy;            
            }
            if(self.serverSupportFollowPost
            && angular.isUndefined(ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer])){
                ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer] = {};
                self.followedPosts = ygUserPref.$storage.followedPosts[ygUserPref.$storage.selectedServer];
            }
        });
    });

    self.followPost = function (post) {
        if(!(post.id in self.followedPosts)){
            self.followedPosts[post.id] = {};
        }
    };

    self.unfollowPost = function (post) {
        if(post.id in self.followedPosts){
            delete self.followedPosts[post.id];
        }        
    };

    self.checkPost = function (post) {
        if(!(post.id in self.followedPosts)){
            self.followedPosts[post.id] = {};
        }
        if(self.followPostBy.indexOf('modify_time') > -1){
            self.followedPosts[post.id]['lastCheckTime'] = new Date();
        }
    }
}]);
