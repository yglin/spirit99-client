'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ProgresscontrollerCtrl
 * @description
 * # ProgresscontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ProgressController', ['$scope', 'message', function ($scope, message) {
    $scope.message = message; 
}]);
