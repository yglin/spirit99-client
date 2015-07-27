'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:PostcontrollerCtrl
 * @description
 * # PostcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

}]);
