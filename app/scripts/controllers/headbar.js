'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:HeadbarCtrl
 * @description
 * # HeadbarCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('HeadBarController', ['$scope', '$mdSidenav', 'ygServer', 'ygFilter',
function($scope, $mdSidenav, ygServer, ygFilter){
    $scope.keywords = ygFilter.keywords.title;
    $scope.ygServer = ygServer;
    $scope.serverTitle = '';
    $scope.serverLogo = '';

    $scope.$watch('ygServer.currentServerName', function(newValue, oldValue){
        // console.log('Got you~!! ' + oldValue + ' --> ' + newValue);
        $scope.serverTitle = '';
        $scope.serverLogo = '';
        if(newValue in ygServer.servers){
            $scope.serverTitle = ygServer.servers[newValue].title;
            $scope.serverLogo = ygServer.servers[newValue].logo;
        }
    });

    $scope.openSidenav = function(){
        $mdSidenav('sidenav-left').open();
    };    
}]);