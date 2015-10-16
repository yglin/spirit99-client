'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:PostcontrollerCtrl
 * @description
 * # PostcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostController', ['$scope', '$resource', '$mdDialog', 'ygUtils', 'ygUserPref', 'ygServer', 'ygFroala', 'ygPost', 'ygFollowPost', 'post',
function ($scope, $resource, $mdDialog, ygUtils, ygUserPref, ygServer, ygFroala, ygPost, ygFollowPost, post) {
    var self = this;

    self.commentResource = ygServer.getSupportComment();
    $scope.isSupportComment = self.commentResource !== false && self.commentResource !== null;
    $scope.isLoadingComments = false;
    if($scope.isSupportComment){
        $scope.isLoadingComments = true;
        self.commentResource.query({post_id:post.id},
        function(responses, headersGetter){
            $scope.comments = responses;
        })
        .$promise.finally(function () {
            $scope.isLoadingComments = false;
        });
        $scope.newComment = new self.commentResource();
    }        

    ygFroala.getFroalaOptions().then(function(options){
        $scope.froalaOptions = options;
        $scope.froalaOptions.minHeight = 50;
    });
    
    $scope.post = post;
    // console.log($scope.post);

    $scope.isMyPost = post.id in ygUserPref.$storage.myPosts[ygServer.selectedServer.name];

    $scope.formatDatetime = ygUtils.formatDatetime;

    $scope.comments = [];

    $scope.canFollowPost = ygFollowPost.supportFollowPost;
    $scope.followPost = $scope.post.id in ygFollowPost.followedPosts;

    $scope.updatePost = ygPost.updatePost;

    $scope.deletePost = ygPost.deletePost;

    $scope.statisticResource = ygServer.getSupportStatistic();
    if($scope.statisticResource){
        if(!('statistics' in $scope.post)){
            $scope.statisticResource.query({post_id: $scope.post.id},
            function (results) {
                if(results.length > 0){
                    $scope.post.statistics = {};
                    for (var i = 0; i < results.length; i++) {
                        $scope.post.statistics[results[i].id]  = results[i];
                    }
                }
                // console.log($scope.post.statistics);
            });
        }

        $scope.statisticPlusOne = function (statistic) {
            $scope.statisticResource.plusOne({post_id: $scope.post.id, id: statistic.id},
            function (result) {
                if('count' in result){
                    statistic.count = result.count;
                }
                statistic.disabled = true;
            });
        };
    }

    $scope.$watch('followPost',
        function (newValue) {
            // console.log(newValue);
            if(newValue){
                ygFollowPost.followPost($scope.post);
            }
            else{
                ygFollowPost.unfollowPost($scope.post);
            }
    });

    $scope.addComment = function (comment) {
        if(!$scope.isSupportComment){
            return;
        }
        $scope.newComment.$save({post_id:$scope.post.id}).then(
        function (result) {
            $scope.comments.push($scope.newComment);
            // Record commented post
            var commentedPosts;
            if(angular.isUndefined(ygUserPref.$storage.commentedPosts)){
                ygUserPref.$storage.commentedPosts = {};
            }
            commentedPosts = ygUserPref.$storage.commentedPosts;
            if(angular.isUndefined(commentedPosts[ygServer.selectedServer.name])){
                commentedPosts[ygServer.selectedServer.name] = {};
            }
            if(angular.isUndefined(commentedPosts[ygServer.selectedServer.name][$scope.post.id])){
                commentedPosts[ygServer.selectedServer.name][$scope.post.id] = 1;
            }
            else{
                commentedPosts[ygServer.selectedServer.name][$scope.post.id] += 1;                
            }
            console.log(ygUserPref.$storage.commentedPosts);
            // Automatic follow post if added comment
            ygFollowPost.followPost($scope.post);
            $scope.followPost = $scope.post.id in ygFollowPost.followedPosts;
            // Reset new comment resource;
            $scope.newComment = new self.commentResource();
        },
        function (error) {
            console.log(error);
        });
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
