'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:PostcontrollerCtrl
 * @description
 * # PostcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostController', ['$scope', '$resource', '$mdDialog', 'ygUtils', 'ygUserPref', 'ygServer', 'ygPost', 'ygFollowPost', 'post',
function ($scope, $resource, $mdDialog, ygUtils, ygUserPref, ygServer, ygPost, ygFollowPost, post) {
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

    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 50,
        language: 'zh-tw',
        placeholder: '留言...'
    };
    $scope.post = post;
    // console.log($scope.post);

    $scope.isMyPost = post.id in ygUserPref.$storage.myPosts;

    $scope.formatDatetime = ygUtils.formatDatetime;

    $scope.comments = [];

    $scope.newComment = {
        context: '',
        author: ''
    };

    $scope.canFollowPost = ygFollowPost.supportFollowPost;
    $scope.followPost = $scope.post.id in ygFollowPost.followedPosts;

    $scope.editPost = function () {
        ygPost.editPost($scope.post);
    };

    $scope.deletePost = function () {
        ygPost.deletePost($scope.post);
    };

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
            $scope.newComment = new self.commentResource();
            // Automatic follow post if added comment
            ygFollowPost.followPost($scope.post);
            $scope.followPost = $scope.post.id in ygFollowPost.followedPosts;
        },
        function (error) {
            console.log(error);
        });
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
