'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygPost
 * @description
 * # ygPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygPost', ['$rootScope', '$timeout', '$q', '$resource', '$mdDialog', 'uiGmapGoogleMapApi', 'ygUtils', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygProgress', 'ygError',
function ($rootScope, $timeout, $q, $resource, $mdDialog, uiGmapGoogleMapApi, ygUtils, ygUserPref, ygUserCtrl, ygServer, ygProgress, ygError) {
    var self = this;

    self.postDataDefaults = {
        icon: 'images/icon-chat-48.png',
        // options: {}
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

    // This function should be override in map.js
    self.filteredPosts.addAsMarker = function (postData) {
          this.push(postData);
    };

    self.validatePostData = function (postData) {
        // XXX: to be implemented
        return true;
    };

    // self.fillDefaultOptions = function (postData) {
    //     for(var key in self.postDataDefaults){
    //         postData[key] = typeof postData[key] === typeof self.postDataDefaults[key] ? postData[key] : self.postDataDefaults[key];
    //     }
    // };

    self.filterPost = function (post, filteredPosts, filters) {
        filteredPosts = Array.isArray(filteredPosts) ? filteredPosts : self.filteredPosts;
        filters = typeof filters === 'undefined' ? ygUserPref.$storage.filters : filters;

        // filter by icon
        if(post.iconName && post.iconName in ygUserCtrl.iconCtrls && !(ygUserCtrl.iconCtrls[post.iconName]==true)){
            return false;
        }

        // filter by keywords
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

        return matchAll;
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
                    var newPost = ygUtils.fillDefaults(responses[i], self.postDataDefaults);
                    self.indexedPosts[newPost.id] = newPost;
                    if(self.filterPost(newPost)){
                        // self.filteredPosts.push(newPost);
                        self.filteredPosts.addAsMarker(newPost);
                    }
                }
            }
            ygUtils.updateMaxBounds(extraParams.bounds);
        }).$promise;
    };

    self.reloadPosts = function(){
        console.log('Reload posts~ ');
        self.filteredPosts.length = 0;
        self.indexedPosts = {};
        if(typeof self.postResource === 'undefined' || self.postResource === null){
            self.postResource = self.buildPostResource(ygUserPref.$storage.selectedServer);
        }
        return self.loadPosts();
    };

    self.popStoryEditor = function (latitude, longitude) {
        if(self.newPost === null){
            self.newPost = new self.postResource();
            // self.newPost = ygUtils.fillDefaults(self.newPost, self.postDataDefaults);
        }
        if(latitude){
            self.newPost['latitude'] = latitude;
        }
        if(longitude){
            self.newPost['longitude'] = longitude;
        }
        // // console.log($scope.newPost);
        return $mdDialog.show({
            templateUrl: 'views/posteditor.html',
            controller: 'PostEditorController',
            clickOutsideToClose: true,
            escapeToClose: false,
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
                    if(self.validatePostData(result) && !(result.id in self.indexedPosts)){
                        self.indexedPosts[result.id] = ygUtils.fillDefaults(result, self.postDataDefaults);
                        if(self.filterPost(self.indexedPosts[result.id])){
                            self.filteredPosts.addAsMarker(self.indexedPosts[result.id]);
                        }
                        self.newPost = null;
                        console.log('Success, post added!!');
                        return $q.resolve();                        
                    }
                    else{
                        return $q.reject('Invalid post data: ' + result.toString());
                    }
                }, function (error) {
                    ygError.errorMessages.push('新增資料至遠端伺服器失敗');
                    return $q.reject(error);
                });
                ygProgress.show('新增資料...', promise);
                return promise;
            }else{
                console.log('Not connected to post resources');
                return $q.reject('Post resource not created yet');
            }
        }, function(newPost){
            for(var key in newPost){
                if(self.newPost[key] !== newPost[key]){
                    self.newPost[key] = newPost[key];
                }
            }
            console.log('你又按錯啦你');
            return $q.reject();
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

    $rootScope.$watch(function () {
        return ygUserPref.$storage.filters;
    }, function  () {
        self.filteredPosts.length = 0;
        for(var id in self.indexedPosts){
            if(self.filterPost(self.indexedPosts[id])){
                // self.filteredPosts.push(self.indexedPosts[id]);
                self.filteredPosts.addAsMarker(self.indexedPosts[id]);
            }
        }
    }, true);        

    self.initialPromises = {};
    self.initialPromises['loadPosts'] = $q.allSettled([ygUserPref.initialPromises['getGeolocation'], ygServer.initialPromises['updateServers'], uiGmapGoogleMapApi])
    .then(function () {
        var deferred = $q.defer();
        $timeout(function () {
            self.reloadPosts().then(function () {
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
        }, 3000);
        return deferred.promise;
    });
}]);
