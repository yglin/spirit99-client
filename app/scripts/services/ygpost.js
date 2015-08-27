'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygPost
 * @description
 * # ygPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygPost', ['$rootScope', '$timeout', '$resource', '$mdDialog', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygProgress',
function ($rootScope, $timeout, $resource, $mdDialog, ygUserPref, ygUserCtrl, ygServer, ygProgress) {
    var self = this;

    self.postDataDefaults = {
        icon: 'images/icon-chat-48.png',
        // thumbnail: 'http://at-cdn-s01.audiotool.com/2012/05/28/documents/ei368KjdlP5qy6gILDLtH9cEAf6H/0/cover256x256-b31436c2a9bc4645b1ad67bc09705cd7.jpg'
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

    self.loadPosts = function () {
        console.log('Load Posts!!');
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
        extraParams.bounds = ygUserPref.$storage.map.bounds;
        console.log(extraParams);
        self.posts = self.postResource.getMarkers(extraParams, function(){
            for (var i = 0; i < self.posts.length; i++) {
                self.fillDefaultOptions(self.posts[i]);
                self.indexedPosts[self.posts[i].id] = self.posts[i];
            }
        });
        // self.posts.promise.then(function(){}, function(){}, function(){
        //     console.log('notify!!');
        // });
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

    self.showPostDetail = function (postID) {
        $mdDialog.show({
            templateUrl: 'views/post.html',
            controller: 'PostController',
            clickOutsideToClose: true,
            locals: {
                postID: postID
            }
        })
        .then(function(response){}, function(response){});
    };

}]);
