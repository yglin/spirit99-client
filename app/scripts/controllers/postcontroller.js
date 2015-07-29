'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:PostcontrollerCtrl
 * @description
 * # PostcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostController', ['$scope', '$mdDialog', 'ygUtils', 'post',
function ($scope, $mdDialog, ygUtils, post) {
    $scope.post = post;
    $scope.create_time = ygUtils.formatDatetime(post.create_time);
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
