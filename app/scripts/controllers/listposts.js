'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ListpostsCtrl
 * @description
 * # ListpostsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ListPostsController', ['$scope', '$interval', '$mdSidenav', 'ygUserPref', 'ygPost',
function ($scope, $interval, $mdSidenav, ygUserPref, ygPost) {
    $scope.mdComponentID = 'sidenav-listposts';
    $scope.lockedOpen = true;
    $scope.focusedPostId = -1;
    $scope.isMouseOverList = false;
    $scope.isScrolling = false;   
    
    $scope.$watch(function () {
        return ygUserPref.$storage.openListPosts;
    }, function (newValue, oldValue) {
        $scope.lockedOpen = newValue;
    });

    $scope.$watch(function () {
        return ygPost.posts;
    }, function () {
        $scope.posts = ygPost.posts;
    })

    $scope.onMouseOverList = function () {
        $scope.isMouseOverList = true;
        // console.log($scope.isMouseOverList);
    };

    $scope.onMouseLeaveList = function () {
        $scope.isMouseOverList = false;
        // console.log($scope.isMouseOverList);
    };

    $interval(function () {
        if(!$mdSidenav('sidenav-listposts').isLockedOpen()){
            return;
        }
        // console.log($scope.isMouseOverList);
        if($scope.focusedPostId != ygUserPref.$storage.focusedPostId && !$scope.isMouseOverList && !$scope.isScrolling){
            // var post_id = ygUserPref.$storage.focusedPostId;
            var container = angular.element(document.getElementById('post-list-container'));
            var target = angular.element(document.getElementById('post-' + ygUserPref.$storage.focusedPostId));
            if(container.length > 0 && target.length > 0){
                $scope.isScrolling = true;
                // console.log('Start scroll!!');
                container.scrollToElementAnimated(target, 50, 2000)
                .then(function () {
                    $scope.focusedPostId = ygUserPref.$storage.focusedPostId;
                    $scope.isScrolling = false;
                    // console.log('Stop scroll!!');
                })
            }        
        }
    }, 100);

    $scope.close = function () {
        ygUserPref.$storage.openListPosts = false;
    };

    $scope.onMouseOverPosts = function (postID) {
        $scope.focusedPostId = postID;
        ygUserPref.$storage.focusedPostId = postID;
    };

    $scope.onClickPost = function (postID) {
        ygPost.showPostDetail(postID);
    };
}]);
