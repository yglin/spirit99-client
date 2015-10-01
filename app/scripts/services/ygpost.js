'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygPost
 * @description
 * # ygPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygPost', ['$rootScope', '$window', '$timeout', '$q', '$resource', 'nodeValidator', '$mdDialog', 'uiGmapGoogleMapApi', 'ygUtils', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygError', 'ygFollowPost', 'ygStatusInfo',
function ($rootScope, $window, $timeout, $q, $resource, nodeValidator, $mdDialog, uiGmapGoogleMapApi, ygUtils, ygUserPref, ygUserCtrl, ygServer, ygError, ygFollowPost, ygStatusInfo) {
    var self = this;

    var PostUserFields = ['title', 'context', 'icon', 'author'];

    self.postDataDefaults = {
        // icon: 'images/icon-chat-48.png',
        // options: {}
        // thumbnail: 'http://at-cdn-s01.audiotool.com/2012/05/28/documents/ei368KjdlP5qy6gILDLtH9cEAf6H/0/cover256x256-b31436c2a9bc4645b1ad67bc09705cd7.jpg'
    };
    self.filteredPosts = [];
    self.indexedPosts = {};
    self.newPost = null;

    self.assignIconObject = function (postData) {};

    uiGmapGoogleMapApi.then(function (googlemaps) {

        self.iconObjects = {
            'default': {
                url: 'images/icon-chat-48.png',
                scaledSize: new googlemaps.Size(36, 36),
            }
        };

        self.assignIconObject = function (postData) {
            if(!nodeValidator.isURL(postData.icon)){
                var iconSet = ygServer.selectedServer.iconSet;
                if(postData.icon in iconSet){
                    postData.iconName = postData.icon;
                    if(!(postData.iconName in self.iconObjects)){
                        if(typeof iconSet[postData.iconName] === 'object'){
                            if('url' in iconSet[postData.iconName]){
                                self.iconObjects[postData.iconName] = {};
                                var source = iconSet[postData.iconName];
                                var transformed = self.iconObjects[postData.iconName];
                                transformed.url = source.url;

                                if('anchor' in source){
                                    transformed.anchor = new googlemaps.Point(source.anchor[0], source.anchor[1]);
                                }
                                if('labelOrigin' in source){
                                    transformed.labelOrigin = new googlemaps.Point(source.labelOrigin[0], source.labelOrigin[1]);
                                }
                                if('origin' in source){
                                    transformed.origin = new googlemaps.Point(source.origin[0], source.origin[1]);
                                }
                                if('scaledSize' in source){
                                    transformed.scaledSize = new googlemaps.Size(source.scaledSize[0], source.scaledSize[1]);
                                }
                                if('size' in source){
                                    transformed.size = new googlemaps.Size(source.size[0], source.size[1]);
                                }
                                // console.log(transformed);
                            }
                            else{
                                // No url, invalid icon object
                                postData.iconName = 'default';
                            }
                        }
                        else if(nodeValidator.isURL(iconSet[postData.iconName])){
                            self.iconObjects[postData.iconName] = {
                                url: iconSet[postData.iconName],
                                scaledSize: new googlemaps.Size(36, 36),
                            };
                        }
                        else{
                            postData.iconName = 'default';
                        }
                    }
                    postData.iconObject = self.iconObjects[postData.iconName];
                }
                else{
                    postData.iconObject = self.iconObjects['default'];
                }
            }
            else{
                postData.iconObject = {
                    url: postData.icon,
                    scaledSize: new googlemaps.Size(36, 36),
                };
            }            
        };
    });

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

    self.filterPost = function (post, filters) {
        filters = typeof filters === 'undefined' ? ygUserPref.$storage.filters : filters;

        // filter by icon
        if(post.iconName && post.iconName in ygUserCtrl.iconCtrls && !(ygUserCtrl.iconCtrls[post.iconName].show)){
            return false;
        }

        var matchAll = true;
        for(var key in filters){
            if(key in post){
                if('keywords' in filters[key] && typeof post[key] === 'string'){
                    for (var i = 0; i < filters[key].keywords.length; i++) {
                        var keyword = filters[key].keywords[i];
                        if(post[key].indexOf(keyword) === -1){
                            matchAll = false;
                        }
                        if(!matchAll){
                            break;
                        }
                    }
                }
                else if('startDate' in filters[key] && 'endDate' in filters[key]){
                    var postDate = new Date(post[key]);
                    var startDate = new Date(filters[key].startDate);
                    var endDate = new Date(filters[key].endDate);
                    matchAll = postDate > startDate && postDate < endDate;
                    // console.log(matchAll + ', ' + postDate + ', ' + filters[key].startDate + ' ~ ' + filters[key].endDate);
                }
                else{
                    matchAll = false;
                }
            }
            else{
                matchAll = false;
            }
            if(!matchAll){
                break;
            }
        }

        return matchAll;
    };

    self.markAsMyPost = function (post) {
        if(!(post.id in ygUserPref.$storage.myPosts)){
            ygUserPref.$storage.myPosts[post.id] = {};
        }
        if('password' in post){
            ygUserPref.$storage.myPosts[post.id].password = post.password;                            
        }
        // console.log(ygUserPref.$storage.myPosts);
    };

    self.readPost = function (post) {
        if('author' in post && 'context' in post){
            console.log('Already got author and context, no need to read post');
            return $q.resolve('Already got author and context, no need to read post');
        }
        var postResource = ygServer.getSupportPost();
        if(!postResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
        }
        ygStatusInfo.statusProcessing('讀取資料...');
        var promise = postResource.getDetails({id:post.id},
        function (result) {
            console.log(result);
            for(var key in result){
                if(!(key in post)){
                    post[key] = result[key];
                }
            }        
        }, function (error) {
            $window.alert('讀取文章內容失敗');
            console.log(error);
        }).$promise;
        promise.finally(function () {
            ygStatusInfo.statusIdle();
        });
        return promise;
    };

    self.loadPosts = function () {
        if(!ygServer.isSelectedServer()){
            console.log('No selected server');
            return $q.reject('No selected server');
        }

        var postResource = ygServer.getSupportPost();
        if(!postResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
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

        ygStatusInfo.statusProcessing('讀取資料...');
        return postResource.getMarkers(extraParams, function(responses){
            console.log('Load ' + responses.length + ' posts');
            for (var i = 0; i < responses.length; i++) {
                if(!(responses[i].id in self.indexedPosts) && self.validatePostData(responses[i])){
                    var newPost = ygUtils.fillDefaults(responses[i], self.postDataDefaults);
                    self.assignIconObject(newPost);
                    if(ygFollowPost.isFollowingPost(newPost) && ygFollowPost.isSomethingNew(newPost)){
                        ygFollowPost.addNotification(newPost);
                    }
                    self.indexedPosts[newPost.id] = newPost;
                    if(self.filterPost(newPost)){
                        // self.filteredPosts.push(newPost);
                        self.filteredPosts.addAsMarker(newPost);
                    }
                }
            }
            ygUtils.updateMaxBounds(extraParams.bounds);
            ygStatusInfo.statusIdle();
        },
        function (error) {
            console.log(error);
            ygStatusInfo.statusIdle();            
        }).$promise;
    };

    self.reloadPosts = function(){
        console.log('Reload posts~ ');
        self.filteredPosts.length = 0;
        self.indexedPosts = {};
        ygUtils.resetMaxBounds();
        return self.loadPosts();
    };

    self.postEditor = function (post) {
        $mdDialog.cancel();
        return $mdDialog.show({
            templateUrl: 'views/posteditor.html',
            controller: 'PostEditorController',
            clickOutsideToClose: true,
            escapeToClose: false,
            locals: {
                newPost: post
            },
        });      
    };

    self.editPost = function (post) {
        self.filteredPosts.splice(self.filteredPosts.indexOf(post), 1);
        self.postEditor(angular.copy(post)).then(function (updatedPost) {
            if(updatedPost.id in ygUserPref.$storage.myPosts){
                updatedPost.password = ygUserPref.$storage.myPosts[updatedPost.id].password;
            }
            updatedPost.$save().then(function (response) {
                self.indexedPosts[updatedPost.id] = updatedPost;
                self.assignIconObject(updatedPost);
                if(self.filterPost(updatedPost)){
                    self.filteredPosts.addAsMarker(updatedPost);
                }
                // console.log(self.indexedPosts[post.id]);
                // console.log(post);
            }, function (error) {
                if(error.status === 401){
                    $window.alert('這可能是別人的文章，你沒有權限更改');
                }
                else{
                    $window.alert('更新失敗!!');
                }
                self.filteredPosts.addAsMarker(post);
                console.log(error);
            });            
        });  
    };

    self.deletePost = function (post) {
        if(post.id in ygUserPref.$storage.myPosts){
            var confirm = $mdDialog.confirm()
            .title('刪除文章')
            .content('確定要刪除<br><br><p><b>' + post.title + '</b></p><br><br>這篇文章?')
            .ariaLabel('刪除文章')
            .ok('確定')
            .cancel('想想還是算了');
            $mdDialog.show(confirm).then(function () {
                self.filteredPosts.splice(self.filteredPosts.indexOf(post), 1);
                var password = ygUserPref.$storage.myPosts[post.id].password;
                post.$delete({id:post.id, password: password}).then(function (response) {
                    delete self.indexedPosts[post.id];
                }, function (error) {
                    self.filteredPosts.addAsMarker(post);
                    if(error.status === 401){
                        $window.alert('這可能是別人的文章，你沒有權限刪除');
                    }
                    else{
                        $window.alert('刪除失敗!!');
                    }
                    console.log(error);
                });
            }, function () {
                console.log('那你再想想吧');
            });
        }
        else{
            $window.alert('這可能是別人的文章，你沒有權限刪除');            
        }
    };

    self.popStoryEditor = function (latitude, longitude) {
        var postResource = ygServer.getSupportPost();
        if(!postResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
        }

        if(self.newPost === null){
            self.newPost = new postResource();
            // self.newPost = ygUtils.fillDefaults(self.newPost, self.postDataDefaults);
        }
        if(latitude){
            self.newPost.latitude = latitude;
        }
        if(longitude){
            self.newPost.longitude = longitude;
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
            var promise = self.newPost.$save()
            .then(function (result) {
                if(self.validatePostData(result) && !(result.id in self.indexedPosts)){
                    var newPost = ygUtils.fillDefaults(result, self.postDataDefaults);
                    self.assignIconObject(newPost);
                    self.indexedPosts[newPost.id] = newPost;
                    if(self.filterPost(self.indexedPosts[newPost.id])){
                        self.filteredPosts.addAsMarker(self.indexedPosts[newPost.id]);
                    }
                    self.markAsMyPost(newPost);
                    ygFollowPost.followPost(newPost);
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
            // ygProgress.show('新增資料...', promise);
            return promise;
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
        var post = self.indexedPosts[postID];        
        self.readPost(post)
        .then(function () {
            $mdDialog.show({
                templateUrl: 'views/post.html',
                controller: 'PostController',
                clickOutsideToClose: true,
                locals: {
                    post: post
                }
            })
            .finally(function () {
                if(ygFollowPost.isFollowingPost(post)){
                    ygFollowPost.removeNotification(post);
                    ygFollowPost.checkPost(post);
                }
            });
        });
    };


    self.initialPromises = {};
    self.initialPromises.loadPosts = $q.allSettled([ygUserPref.initialPromises.getGeolocation, ygServer.initialPromises.updateServers, uiGmapGoogleMapApi])
    .then(function () {
        var deferred = $q.defer();
        $timeout(function () {
            self.reloadPosts().then(function () {
                // console.log(self.indexedPosts);
                // console.log(self.filteredPosts);
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
        }, 3000);

        $rootScope.$watch(function () {
            return ygServer.selectedServer;
        }, function () {
            self.reloadPosts();
        });

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

        $rootScope.$watch(function () {
            return ygUserCtrl.iconCtrls;
        }, function  () {
            self.filteredPosts.length = 0;
            for(var id in self.indexedPosts){
                if(self.filterPost(self.indexedPosts[id])){
                    // self.filteredPosts.push(self.indexedPosts[id]);
                    self.filteredPosts.addAsMarker(self.indexedPosts[id]);
                }
            }
        }, true);        

        return deferred.promise;
    });
}]);
