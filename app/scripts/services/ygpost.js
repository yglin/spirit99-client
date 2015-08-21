'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygPost
 * @description
 * # ygPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygPost', ['$rootScope', '$resource', '$mdDialog', 'ygUserPref', 'ygServer', 'ygProgress',
function ($rootScope, $resource, $mdDialog, ygUserPref, ygServer, ygProgress) {
    var self = this;

    self.postDataDefaults = {
        icon: 'images/icon-chat-48.png'
    };
    self.posts = [];
    self.indexedPosts = {};
    self.newPost = null;
    self.postResource = null;
    self.postResourceActions = {
        'getMarkers': {
            method: 'GET',
            isArray: true,
            params: {
                fields: ['id', 'title', 'latitude', 'longitude', 'icon']
            }
        }
    };


    self.fillDefaultOptions = function (postData) {
        for(var key in self.postDataDefaults){
            postData[key] = typeof postData[key] === typeof self.postDataDefaults[key] ? postData[key] : self.postDataDefaults[key];
        }
    };

    self.reloadPosts = function(){
        self.posts = [];
        self.indexedPosts = {};
        self.postResource = null;
        var selectedServer = ygUserPref.$storage.selectedServer
        if(!(selectedServer in ygServer.servers)){
            console.log('Can not find server: ' + selectedServer);
            return;
        }
        var postUrl = ygServer.servers[selectedServer].postUrl;
        if(!postUrl){
            console.log('Not found postUrl in server portal data: ');
            console.log(ygServer.servers[selectedServer]);
            return;
        }

        // Create new post resource for current server
        self.postResource = $resource(postUrl + '/:id', {}, self.postResourceActions);

        var filterCircle = ygUserPref.$storage.filterCircle;
        var extraParams = {};
        if(filterCircle.visible){
            extraParams.filterCircle = {
                center: filterCircle.center,
                radius: filterCircle.radius
            };
        }
        self.posts = self.postResource.getMarkers(extraParams, function(){
            for (var i = 0; i < self.posts.length; i++) {
                self.fillDefaultOptions(self.posts[i]);
                self.indexedPosts[self.posts[i].id] = self.posts[i];
            }
        });
    }

    self.popStoryEditor = function (latitude, longitude) {
        if(self.newPost === null){
            self.newPost = new self.postResource();
            self.fillDefaultOptions(self.newPost);
        }
        self.newPost['latitude'] = latitude;
        self.newPost['longitude'] = longitude;
        // // console.log($scope.newPost);
        return $mdDialog.show({
            templateUrl: 'views/posteditor.html',
            controller: 'PostEditorController',
            clickOutsideToClose: true,
            locals: {
                newPost: self.newPost
            },
        })
        .then(function(newPost){
            for(var key in newPost){
                if(self.newPost[key] !== newPost[key]){
                    self.newPost[key] = newPost[key];
                }
            }
            if(self.postResource !== null){
                var promise = self.newPost.$save()
                .then(function (result) {
                        console.log('Success, post added!!');
                        self.fillDefaultOptions(self.newPost);
                        self.posts.push(self.newPost);
                        self.newPost = null;
                    }, function (error) {
                        console.log('BoooooooM~!!!, adding post failed');
                });
                ygProgress.show('新增資料...', promise);
            }else{
                console.log('Not connected to post resources');
            }
        }, function(newPost){
            for(var key in newPost){
                if(self.newPost[key] !== newPost[key]){
                    self.newPost[key] = newPost[key];
                }
            }
            console.log('你又按錯啦你');
        });
    };

    // $watch-es
    $rootScope.$watch(function () {
        return ygUserPref.$storage.selectedServer;
    }, function (newValue, oldValue) {
        self.reloadPosts();
    });

}]);
