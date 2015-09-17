'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:InfowindowcontrollerCtrl
 * @description
 * # InfowindowcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('InfoWindowController', ['$scope', 'ygConnect',
function ($scope, ygConnect) {
    $scope.canConnectPosts = ygConnect.canConnectPosts;
    // console.log($scope.canConnectPosts);
    
    $scope.selectConnectingPost = ygConnect.selectConnectingPost;
}]);
