'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ListpostsCtrl
 * @description
 * # ListpostsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ListPostsController', ['$scope', '$interval', '$mdSidenav', 'ygUserCtrl', 'ygPost', 'ygAudio',
function ($scope, $interval, $mdSidenav, ygUserCtrl, ygPost, ygAudio) {
    $scope.mdComponentID = 'sidenav-listposts';
    $scope.lockedOpen = true;
    $scope.focusedPostId = -1;
    $scope.isMouseOverList = false;
    $scope.isScrolling = false;   
    $scope.posts = ygPost.filteredPosts;
    
    $scope.$watch(function () {
        return ygUserCtrl.openListPosts;
    }, function (newValue, oldValue) {
        $scope.lockedOpen = newValue;
    });

    // $scope.$watch(function () {
    //     return ygPost.filteredPosts;
    // }, function () {
    //     $scope.posts = ygPost.filteredPosts;
    // })

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
        if($scope.focusedPostId != ygUserCtrl.focusedPostId && !$scope.isMouseOverList && !$scope.isScrolling){
            var container = angular.element(document.getElementById('post-list-container'));
            var target = angular.element(document.getElementById('post-' + ygUserCtrl.focusedPostId));
            if(container.length > 0 && target.length > 0){
                $scope.isScrolling = true;
                // console.log('Start scroll!!');
                container.scrollToElementAnimated(target, 50, 2000)
                .then(function () {
                    $scope.focusedPostId = ygUserCtrl.focusedPostId;
                    $scope.isScrolling = false;
                    // console.log('Stop scroll!!');
                })
            }        
        }
    }, 100);

    $scope.close = function () {
        if(ygAudio.closeListPosts){
            // console.log(ygAudio.closeListPosts);
            ygAudio.closeListPosts.play();
        }
        ygUserCtrl.openListPosts = false;
    };

    $scope.onMouseOverPosts = function (postID) {
        $scope.focusedPostId = postID;
        ygUserCtrl.focusedPostId = postID;
    };

    $scope.onClickPost = function (postID) {
        ygPost.showPostDetail(postID);
    };
}]);
