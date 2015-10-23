'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:IconCtrlCtrl
 * @description
 * # IconCtrlCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('IconCtrlController', ['$scope', 'ygUserCtrl', 'ygAudio',
function ($scope, ygUserCtrl, ygAudio) {
    $scope.iconCtrls = ygUserCtrl.iconCtrls;

    $scope.toggleIcon = function (name) {
        $scope.iconCtrls[name].show = !($scope.iconCtrls[name].show);
        ygAudio.play('toggleIconCtrl');
    };

    $scope.hideAll = function () {
        for(var key in $scope.iconCtrls){
            $scope.iconCtrls[key].show = false;
        }
    };

    $scope.showAll = function () {
        for(var key in $scope.iconCtrls){
            $scope.iconCtrls[key].show = true;
        }
    };

}]);
