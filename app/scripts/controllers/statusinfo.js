'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StatusinfoCtrl
 * @description
 * # StatusinfoCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('StatusInfoController', ['$scope', 'ygStatusInfo',
function ($scope, ygStatusInfo) {
    $scope.message = ygStatusInfo.message;
    $scope.$watch(function () {
        return ygStatusInfo.message;
    }, function () {
        $scope.message = ygStatusInfo.message;
    });

    $scope.showProgress = ygStatusInfo.isProgressing;
    $scope.$watch(function () {
        return ygStatusInfo.isProgressing;
    }, function () {
        $scope.showProgress = ygStatusInfo.isProgressing;
    });
}]);
