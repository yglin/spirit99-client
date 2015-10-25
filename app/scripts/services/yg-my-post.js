'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygMyPosts
 * @description
 * # ygMyPosts
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygMyPost', ['$rootScope', 'ygUserPref', 'ygServer',
function ($rootScope, ygUserPref, ygServer) {
    var self = this;
    self.myPosts = {};
    self.myCommented = {};

    self.switchServer = function (server) {
        if(angular.isUndefined(ygUserPref.$storage.myPosts)){
            ygUserPref.$storage.myPosts = {};
        }
        if(angular.isUndefined(ygUserPref.$storage.myPosts[server.name])){
            ygUserPref.$storage.myPosts[server.name] = {};
        }
        self.myPosts = ygUserPref.$storage.myPosts[server.name];

        if(angular.isUndefined(ygUserPref.$storage.myCommented)){
            ygUserPref.$storage.myCommented = {};
        }
        if(angular.isUndefined(ygUserPref.$storage.myCommented[server.name])){
            ygUserPref.$storage.myCommented[server.name] = {};
        }
        self.myCommented = ygUserPref.$storage.myCommented[server.name];
    };

    ygServer.initialPromises.updateServers.then(function () {
        self.switchServer(ygServer.selectedServer);

        $rootScope.$watch(function () {
            return ygServer.selectedServer;
        }, function () {
            self.switchServer(ygServer.selectedServer);
        });
    });


    self.isMyPost = function (post) {
        return post.id in self.myPosts;
    };

    self.addMyPost = function (post) {
        if(!self.isMyPost(post)){
            self.myPosts[post.id] = {};
        }
        if('password' in post){
            self.myPosts[post.id].password = post.password;                            
        }
    };

    self.getPassword = function (post) {
        if(self.isMyPost(post) && 'password' in self.myPosts[post.id]){
            return self.myPosts[post.id].password;
        }
        else{
            return null;
        }
    };

    self.isMyCommented = function (post) {
        return post.id in self.myCommented;        
    };

    self.addMyCommented = function (post) {
        if(!self.isMyCommented(post)){
            self.myCommented[post.id] = {};
            self.myCommented[post.id].count = 1;
        }
        else{
            self.myCommented[post.id].count += 1;
        }
    };
}]);
