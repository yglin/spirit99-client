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

    self.validatePostData = function (postData) {
        // XXX: to be implemented
        return true;
    };

    self.fillDefaultOptions = function (postData) {
        for(var key in self.postDataDefaults){
            postData[key] = typeof postData[key] === typeof self.postDataDefaults[key] ? postData[key] : self.postDataDefaults[key];
        }
    };

    self.buildPostResource = function (selectedServer) {
        if(!(selectedServer in ygServer.servers)){
            console.log('Can not find server: ' + selectedServer);
            return false;
        }
        var postUrl = ygServer.servers[selectedServer].postUrl;
        if(!postUrl){
            console.log('Not found postUrl in server portal data: ');
            console.log(ygServer.servers[selectedServer]);
            return false;
        }
        // Create new post resource for current server
        return $resource(postUrl + '/:id', {}, self.postResourceActions);                
    };

    self.loadPosts = function () {
        console.log('Load Posts!!');
        if(typeof self.postResource === 'undefined' || self.postResource === null){
            console.log('Post resource not created');
            return;
        }
        var extraParams = {};

        var filterCircle = ygUserPref.$storage.filterCircle;
        if(filterCircle.visible){
            extraParams.filterCircle = {
                center: filterCircle.center,
                radius: filterCircle.radius
            };
        }
        extraParams.bounds = ygUserPref.$storage.map.bounds;

        // console.log(extraParams);

        return self.postResource.getMarkers(extraParams, function(responses){
            for (var i = 0; i < responses.length; i++) {
                if(!(responses[i].id in self.indexedPosts) && self.validatePostData(responses[i])){
                    var newPost = responses[i];
                    self.fillDefaultOptions(newPost);
                    self.indexedPosts[newPost.id] = newPost;
                    self.posts.push(newPost);
                }
            }
        }).$promise;
    };

    self.reloadPosts = function(){
        console.log('Reload posts~ ');
        self.posts = [];
        self.indexedPosts = {};
        if(typeof self.postResource === 'undefined' || self.postResource === null){
            self.postResource = self.buildPostResource(ygUserPref.$storage.selectedServer);
        }
        return self.loadPosts();
    };

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

    // $rootScope.$watch(function () {
    //     return ygUserPref.$storage.selectedServer;
    // }, function (newValue, oldValue) {
    //     self.postResource = self.buildPostResource(ygUserPref.$storage.selectedServer);
    //     self.reloadPosts();
    // });
}]);
