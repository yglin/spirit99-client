'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ListpostsCtrl
 * @description
 * # ListpostsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostListController', ['$scope', '$q', '$interval', '$mdSidenav', 'ygUserCtrl', 'ygPost', 'ygAudio',
function ($scope, $q, $interval, $mdSidenav, ygUserCtrl, ygPost, ygAudio) {
    $scope.mdComponentID = 'sidenav-postList';
    $scope.lockedOpen = false;
    $scope.focusedPostId = -1;
    $scope.isMouseOverList = false;
    $scope.isScrolling = false;   
    
    ygPost.initialPromises.loadPosts
    .finally(function () {
        $scope.posts = ygPost.filteredPosts;
        $scope.$watch(function () {
            return ygUserCtrl.openPostList;
        }, function (newValue, oldValue) {
            if(newValue !== oldValue){
                $scope.lockedOpen = newValue;
                if(newValue){
                    ygAudio.play('openPostList');
                }
                else{
                    ygAudio.play('closePostList');
                }
            }
        });
    });

    $scope.onMouseOverList = function () {
        $scope.isMouseOverList = true;
        // console.log($scope.isMouseOverList);
    };

    $scope.onMouseLeaveList = function () {
        $scope.isMouseOverList = false;
        // console.log($scope.isMouseOverList);
    };

    $interval(function () {
        if(!$mdSidenav('sidenav-postList').isLockedOpen()){
            return;
        }
        // console.log($scope.isMouseOverList);
        if($scope.focusedPostId !== ygUserCtrl.focusedPostId && !$scope.isMouseOverList && !$scope.isScrolling){
            var container = angular.element(document.getElementById('post-list-container'));
            var target = angular.element(document.getElementById('post-' + ygUserCtrl.focusedPostId));
            if(container.length > 0 && target.length > 0){
                $scope.isScrolling = true;
                // console.log('Start scroll!!');
                ygAudio.play('scrollPostList');
                container.scrollToElementAnimated(target, 50, 2000)
                .then(function () {
                    $scope.focusedPostId = ygUserCtrl.focusedPostId;
                    $scope.isScrolling = false;
                    // console.log('Stop scroll!!');
                });
            }        
        }
    }, 100);

    $scope.close = function () {
        ygUserCtrl.openPostList = false;
    };

    $scope.onMouseOverPosts = function (postID) {
        ygAudio.play('focusOnPost');
        $scope.focusedPostId = postID;
        ygUserCtrl.focusedPostId = postID;
    };

    $scope.onClickPost = function (postID) {
        ygPost.showPostDetail(postID);
    };
}]);
