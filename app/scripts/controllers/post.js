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
    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 50,
        language: 'zh-tw',
        placeholder: '留言...'
    };
    $scope.post = post;

    $scope.formatDatetime = ygUtils.formatDatetime;

    $scope.commentsResource = null;
    $scope.comments = [];

    $scope.newComment = {
        context: '',
        author: ''
    };

    $scope.canFollowPost = ygFollowPost.serverSupportFollowPost;
    $scope.followPost = $scope.post.id in ygFollowPost.followedPosts;

    if($scope.followPost){
        console.log(ygFollowPost.followedPosts[$scope.post.id].lastCheckTime);
    }

    $scope.postLoaded = false;
    ygPost.postResource.get({id:post.id},
    function(result, getResponseHeaders){
        for(var key in result){
            if(!(key in $scope.post)){
                $scope.post[key] = result[key];
            }
        }        
        $scope.postLoaded = true;

        // Load comments
        var links = ygUtils.getHateoasLinks(getResponseHeaders());
        if('comments' in links){
            $scope.commentsResource = $resource(links['comments'] + '/:id');
            $scope.comments = $scope.commentsResource.query(
            function (results) {
            },
            function (error) {
                // body...
            });

            $scope.newComment = new $scope.commentsResource();
        }
    },
    function(error){

    });

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
        if($scope.commentsResource === null){
            return;
        }
        $scope.newComment.$save().then(
        function (result) {
            $scope.comments.push($scope.newComment);
            $scope.newComment = new $scope.commentsResource();
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
