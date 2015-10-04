'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:UserSettingsCtrl
 * @description
 * # UserSettingsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('UserSettingsController', ['$scope', 'ygUserPref', function ($scope, ygUserPref) {
    $scope.settings = ygUserPref.$storage;
    // $scope.$watch(function () {
    //     return $scope.startAtGeolocation;
    // }, function () {
    //     console.log('startAtGeolocation = ', $scope.startAtGeolocation);
    //     ygUserPref.$storage.startAtGeolocation = $scope.startAtGeolocation;
    // });
}]);
