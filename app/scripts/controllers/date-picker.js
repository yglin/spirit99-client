'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:DatePickerCtrl
 * @description
 * # DatePickerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('DatePickerController', ['$scope', '$mdDialog', 'create_time',
function ($scope, $mdDialog, create_time) {
    // console.log(create_time);
    $scope.startDate = create_time.startDate;
    $scope.endDate = create_time.endDate;

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.confirm = function () {
        $mdDialog.hide({
            startDate: $scope.startDate,
            endDate: $scope.endDate
        });
    };
}]);
