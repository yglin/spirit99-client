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


    $scope.focusedPostId = -1;
    $interval(function () {
        if(!$mdSidenav('sidenav-listposts').isLockedOpen()){
            return;
        }
        if($scope.focusedPostId != ygUserPref.$storage.focusedPostId){
        var post_id = ygUserPref.$storage.focusedPostId;
        var container = angular.element(document.getElementById('post-list-container'));
            var target = angular.element(document.getElementById('post-' + post_id));
            if(container.length > 0 && target.length > 0){
                container.scrollToElement(target, 0, 2000);
                // console.log('Scroll to ' + post_id);
                $scope.focusedPostId = post_id;
            }        
        }
    }, 100);

    $scope.close = function () {
        ygUserPref.$storage.openListPosts = false;
    };


}]);
