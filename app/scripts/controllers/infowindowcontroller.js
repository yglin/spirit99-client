'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:InfowindowcontrollerCtrl
 * @description
 * # InfowindowcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('InfoWindowController', ['$scope', '$http', 'ygServer', function ($scope, $http, ygServer) {
    // console.log($scope.parameter);
    // $scope.parameter.thumbnail = 'http://www.thefinancialblogger.com/wp-content/uploads/2012/12/dr-evil-150x150.jpg';
    if(!($scope.parameter.thumbnail) && !(ygServer.currentServer.noThumbnail)){
        var thumbnailUrl = ygServer.currentServer.postUrl + '/' + $scope.parameter.id + '/thumbnail';
        $http.get(thumbnailUrl).then(
            function (response) {
                $scope.parameter.thumbnail = response;
            },
            function (error) {
                console.log(error);
        });
    }
}]);
