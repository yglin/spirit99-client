'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygPost
 * @description
 * # ygPost
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygPost', ['$rootScope', '$window', '$timeout', '$q', '$resource', 'nodeValidator', '$mdDialog', 'uiGmapGoogleMapApi', 'ygUtils', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygMyPost', 'ygError', 'ygFollowPost', 'ygStatusInfo',
function ($rootScope, $window, $timeout, $q, $resource, nodeValidator, $mdDialog, uiGmapGoogleMapApi, ygUtils, ygUserPref, ygUserCtrl, ygServer, ygMyPost, ygError, ygFollowPost, ygStatusInfo) {
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

        self.assignIconObject = function (postData) {
            var iconSet = ygServer.getSupportIconSet();
            if(nodeValidator.isURL(postData.icon)){
                postData.iconObject = postData.icon;
            }
            else if(iconSet){
                if(postData.icon in iconSet){
                    postData.iconName = postData.icon;
                    postData.iconObject = iconSet[postData.iconName];
                }
                else{
                    postData.iconName = 'default';
                    postData.iconObject = iconSet.default;
                }
            }
        };
    });

    // This function should be override in map.js
    self.filteredPosts.addAsMarker = function (post) {
        self.getThumbnail(post);
        if(ygMyPost.isMyPost(post)){
            if(!('options' in post)){
                post.options = {};
            }
            post.options.draggable = true;
        }
        this.push(post);
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

        // filter my posts
        if(!angular.isUndefined(filters.myPosts) && filters.myPosts !== null){
            if(filters.myPosts === 'myPosts'){
                if(ygMyPost.isMyPost(post)){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(filters.myPosts === 'commentedPosts'){
                if(ygMyPost.isMyCommented(post)){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(filters.myPosts === 'followedPosts'){
                if(ygFollowPost.isFollowingPost(post)){
                    return true;
                }
                else{
                    return false;
                }                
            }
        }

        // filter by icon
        if(post.iconName && post.iconName in ygUserCtrl.iconCtrls && !(ygUserCtrl.iconCtrls[post.iconName].show)){
            return false;
        }

        var matchAll = true;
        for(var key in filters){
            if(key === 'myPosts'){
                continue;
            }
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
                    startDate.setHours(0, 0, 0, 0);
                    var endDate = new Date(filters[key].endDate);
                    endDate.setHours(23, 59, 59, 999);
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

    self.loadPosts = function () {
        if(!ygServer.isSelectedServer()){
            console.log('No selected server');
            return $q.reject('No selected server');
        }

        var PostResource = ygServer.getSupportPost();
        if(!PostResource){
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
        // return PostResource.getMarkers(extraParams, function(responses){
        return PostResource.query(extraParams, function (responses) {
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

    self.createPost = function (latitude, longitude){
        var PostResource = ygServer.getSupportPost();
        if(!PostResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
        }

        if(self.newPost === null){
            self.newPost = new PostResource();
            // self.newPost = ygUtils.fillDefaults(self.newPost, self.postDataDefaults);
        }
        self.newPost.latitude = angular.isUndefined(latitude) ? self.newPost.latitude : latitude;
        self.newPost.longitude = angular.isUndefined(longitude) ? self.newPost.longitude : longitude;

        // // console.log($scope.newPost);
        return self.postEditor(self.newPost)
        .then(function(){
            return PostResource.create(self.newPost,
            function (result) {
                if(self.validatePostData(result) && !(result.id in self.indexedPosts)){
                    var newPost = ygUtils.fillDefaults(result, self.postDataDefaults);
                    self.assignIconObject(newPost);
                    self.indexedPosts[newPost.id] = newPost;
                    if(self.filterPost(self.indexedPosts[newPost.id])){
                        self.filteredPosts.addAsMarker(self.indexedPosts[newPost.id]);
                    }
                    ygMyPost.addMyPost(newPost);
                    ygFollowPost.followPost(newPost);

                    // Add new votes
                    var voteResource = ygServer.getSupportVote();
                    var newVotes = self.newPost.newVotes;
                    if(voteResource && !angular.isUndefined(newVotes) && newVotes !== null){
                        self.addVotes(result.id, newVotes);
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
            }).$promise;
        }, function(){
            console.log('你又按錯啦你');
            return $q.reject();
        });
    };

    self.readPost = function (post) {
        if('author' in post && 'context' in post){
            // console.log('Already got author and context, no need to read post');
            return $q.resolve('Already got author and context, no need to read post');
        }
        var PostResource = ygServer.getSupportPost();
        if(!PostResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
        }
        ygStatusInfo.statusProcessing('讀取資料...');
        var promise = PostResource.getDetails({id:post.id},
        function (result) {
            // console.log(result);
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

    self.updatePost = function (id, data) {
        var PostResource = ygServer.getSupportPost();
        if(!PostResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
        }
        var post = self.indexedPosts[id];
        var password = ygMyPost.getPassword(post);
        if(!password){
            $window.alert('這可能是別人的文章，你沒有權限更改');
            return $q.reject(); 
        }
        self.filteredPosts.splice(self.filteredPosts.indexOf(post), 1);
        ygStatusInfo.statusProcessing('更新文章資料...');
        var promise = PostResource.update({id: id, password: password}, data,
        function (response) {
            self.indexedPosts[id] = response;
            self.assignIconObject(response);

            // console.log(tempPost.votes);
            var voteResource = ygServer.getSupportVote();
            if(voteResource){
                if('votes' in data){
                    // Delete votes
                    for(var vote_id in data.votes){
                        if(data.votes[vote_id].tobeDeleted === true){
                            voteResource.delete({post_id: id, id: vote_id, password: password});
                        }
                    }                    
                }
                if('newVotes' in data && data.newVotes !== null){
                    self.addVotes(id, data.newVotes);
                }
            }
        }, function (error) {
            if(error.status === 401){
                $window.alert('這可能是別人的文章，你沒有權限更改');
            }
            else{
                $window.alert('更新失敗!!');
            }
            console.log(error);
        }).$promise;
        promise.finally(function () {
            if(self.filterPost(self.indexedPosts[post.id])){
                self.filteredPosts.addAsMarker(self.indexedPosts[post.id]);
            }            
            ygStatusInfo.statusIdle();
        });
        return promise;
        
    };

    self.editPost = function (post) {
        var tempPost = angular.copy(post);
        return self.postEditor(tempPost).then(function (tempPost) {
            return self.updatePost(post.id, tempPost);
        });  
    };

    self.deletePost = function (post) {
        var PostResource = ygServer.getSupportPost();
        if(!PostResource){
            console.log('Post resource not supported by server');
            return $q.reject('Post resource not supported by server');
        }
        if(ygMyPost.isMyPost(post)){
            var confirm = $mdDialog.confirm()
            .title('刪除文章')
            .content('確定要刪除<br><br><p><b>' + post.title + '</b></p><br><br>這篇文章?')
            .ariaLabel('刪除文章')
            .ok('確定')
            .cancel('想想還是算了');
            return $mdDialog.show(confirm).then(function () {
                self.filteredPosts.splice(self.filteredPosts.indexOf(post), 1);
                var password = ygMyPost.getPassword(post);
                
                return PostResource.delete({id:post.id, password: password},
                function (response) {
                    delete self.indexedPosts[post.id];
                    return $q.resolve();
                }, function (error) {
                    self.filteredPosts.addAsMarker(post);
                    if(error.status === 401){
                        $window.alert('這可能是別人的文章，你沒有權限刪除');
                    }
                    else{
                        $window.alert('刪除失敗!!');
                    }
                    console.log(error);
                    return $q.reject();
                }).$promise;
            }, function () {
                console.log('那你再想想吧');
                return $q.resolve();
            });
        }
        else{
            $window.alert('這可能是別人的文章，你沒有權限刪除');
            return $q.reject();            
        }
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

    self.addVotes = function (post_id, votes) {
        var voteResource = ygServer.getSupportVote();
        if(voteResource){
            for(var key in votes){
                votes[key].$save({post_id: post_id});
            }
        }
    };

    self.getThumbnail = function (post) {
        post = typeof post === 'number' ? self.indexedPosts[post] : post;
        if(post.thumbnail){
            return $q.resolve(post.thumbnail);
        }
        else{
            return self.readPost(post).then(function () {
                var rex = /<img[^>]+src\s*=\s*"([^"\s]+)"/i;
                // console.log(post.context);
                var match = rex.exec(post.context);
                // console.log(match);
                if(match){
                    post.thumbnail = match[1];
                }
                else{
                    post.thumbnail = null;
                }
                return $q.resolve(post.thumbnail);
            }, function (error) {
                return $q.reject(error);
            });
        }
    };

    self.initialPromises = {};
    self.initialPromises.loadPosts = $q.allSettled([ygUserPref.initialPromises.startUpAtMap, ygServer.initialPromises.updateServers, uiGmapGoogleMapApi])
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
        }, function (newValue, oldValue) {
            // Check to avoid listener function being called initially even if newValue == oldValue.
            if(newValue !== oldValue){
                self.reloadPosts();
            }
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
