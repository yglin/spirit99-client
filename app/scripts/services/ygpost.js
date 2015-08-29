'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygPost
 * @description
 * # ygPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygPost', ['$rootScope', '$timeout', '$q', '$resource', '$mdDialog', 'ygUtils', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygProgress',
function ($rootScope, $timeout, $q, $resource, $mdDialog, ygUtils, ygUserPref, ygUserCtrl, ygServer, ygProgress) {
    var self = this;

    self.postDataDefaults = {
        icon: 'images/icon-chat-48.png',
        options: {}
        // thumbnail: 'http://at-cdn-s01.audiotool.com/2012/05/28/documents/ei368KjdlP5qy6gILDLtH9cEAf6H/0/cover256x256-b31436c2a9bc4645b1ad67bc09705cd7.jpg'
    };
    self.filteredPosts = [];
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

    self.filterPost = function (post, filteredPosts, filters) {
        filteredPosts = Array.isArray(filteredPosts) ? filteredPosts : self.filteredPosts;
        filters = typeof filters === 'undefined' ? ygUserPref.$storage.filters : filters;

        var matchAll = true;
        for(var key in filters){
            if(key in post && typeof post[key] === 'string'){
                for (var i = 0; i < filters[key].length; i++) {
                    var keyword = filters[key][i];
                    if(post[key].indexOf(keyword) == -1){
                        matchAll = false;
                    }
                    if(!matchAll)break;
                }
            }
            else{
                matchAll = false;
            }
            if(!matchAll)break;
        }            

        if(matchAll){
            filteredPosts.push(post);
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
        // console.log('Load Posts!!');
        if(typeof self.postResource === 'undefined' || self.postResource === null){
            console.log('Post resource not created');
            return $q.reject('Post resource not created');
        }

        if(ygUtils.withinMaxBounds(ygUserPref.$storage.map.bounds)){
            console.log('Bounds within max bounds, no need to load new posts');
            return $q.resolve('Bounds within max bounds, no need to load new posts');
        }
        var extraParams = {};

        // extraParams.postsLoaded = Object.keys(self.indexedPosts);

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
            console.log('Load ' + responses.length + ' posts');
            for (var i = 0; i < responses.length; i++) {
                if(!(responses[i].id in self.indexedPosts) && self.validatePostData(responses[i])){
                    var newPost = responses[i];
                    self.fillDefaultOptions(newPost);
                    self.indexedPosts[newPost.id] = newPost;
                    self.filterPost(newPost);
                }
            }
            ygUtils.updateMaxBounds(extraParams.bounds);
        }).$promise;
    };

    self.reloadPosts = function(){
        console.log('Reload posts~ ');
        self.filteredPosts = [];
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
                        self.filteredPosts.push(self.newPost);
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

    self.startWatches = function () {
        $rootScope.$watch(function () {
            return ygUserPref.$storage.filters;
        }, function  (newValue, oldValue) {
            self.filteredPosts = [];
            console.log(self.filteredPosts);
            for(var id in self.indexedPosts){
                self.filterPost(self.indexedPosts[id]);
                // console.log('post ' + id + ' visible is ' + self.indexedPosts[id].options.visible);
            }
            console.log(self.filteredPosts);
            // for (var i = 0; i < self.filteredPosts.length; i++) {
            //     if(!self.filteredPosts[i].options.visible){
            //         console.log('post ' + self.filteredPosts[i].id + ' is hide!!');
            //     }
            // }
            // for(var id in self.indexedPosts){
            //     if(self.indexedPosts[id].options.visible){
            //         console.log('post ' + id + ' is visible!!');
            //     }                
            // }
        }, true);        
    };
    // $rootScope.$watch(function () {
    //     return ygUserPref.$storage.selectedServer;
    // }, function (newValue, oldValue) {
    //     self.postResource = self.buildPostResource(ygUserPref.$storage.selectedServer);
    //     self.reloadPosts();
    // });
}]);
