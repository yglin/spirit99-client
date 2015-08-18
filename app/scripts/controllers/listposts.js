'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ListpostsCtrl
 * @description
 * # ListpostsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ListPostsController', ['$scope', 'ygUserPref', function ($scope, ygUserPref) {
    $scope.lockedOpen = false;
    $scope.$watch(function () {
        return ygUserPref.$storage.openListPosts;
    }, function (newValue, oldValue) {
        $scope.lockedOpen = newValue;
    });
}]);
