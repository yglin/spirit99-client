'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ListpostsCtrl
 * @description
 * # ListpostsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ListPostsController', ['$scope', '$mdSidenav', 'ygUserPref', 'ygPost',
function ($scope, $mdSidenav, ygUserPref, ygPost) {
    $scope.lockedOpen = false;
    
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

    $scope.close = function () {
        ygUserPref.$storage.openListPosts = false;
    };
}]);
