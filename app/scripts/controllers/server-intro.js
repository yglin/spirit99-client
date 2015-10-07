'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ServerIntroCtrl
 * @description
 * # ServerIntroCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ServerIntroController', ['$scope', '$sce', 'nodeValidator', 'ygServer', 'server',
function ($scope, $sce, nodeValidator, ygServer, server) {
    // console.log(server);
    $scope.server = server;
    $scope.introUrl = null;
    $scope.introContent = '這電台沒提供簡介...';
    if('intro' in $scope.server){
        if(nodeValidator.isURL($scope.server.intro)){
            $scope.introUrl = $sce.trustAsResourceUrl($scope.server.intro);
            $scope.introContent = '';
        }
        else if(typeof $scope.server.intro === 'string'){
            $scope.introUrl = '';
            $scope.introContent = $scope.server.intro;
        }
    }
    $scope.isAlreadySelected = $scope.server.name === ygServer.selectedServer.name;
    $scope.switchServer = ygServer.switchServer;
}]);
