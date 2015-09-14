'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:PostcontrollerCtrl
 * @description
 * # PostcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostController', ['$scope', '$resource', '$mdDialog', 'ygUtils', 'ygUserPref', 'ygServer', 'ygPost', 'post',
function ($scope, $resource, $mdDialog, ygUtils, ygUserPref, ygServer, ygPost, post) {
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

    $scope.canFollowPost = !angular.isUndefined(ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy) && ygServer.servers[ygUserPref.$storage.selectedServer].followPostBy != null;

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



    $scope.addComment = function (comment) {
        if($scope.commentsResource === null){
            return;
        }
        $scope.newComment.$save().then(
        function (result) {
            $scope.comments.push($scope.newComment);
            $scope.newComment = new $scope.commentsResource();
        },
        function (error) {
            console.log(error);
        });
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
