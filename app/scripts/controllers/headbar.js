'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:HeadbarCtrl
 * @description
 * # HeadbarCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('HeadBarController', ['$scope', '$mdSidenav', 'ygUserPref', 'ygServer', 'ygFilter',
function($scope, $mdSidenav, ygUserPref, ygServer, ygFilter){
    $scope.keywords = ygFilter.keywords.title;
    $scope.serverTitle = '請選擇站點';
    $scope.serverLogo = '';

    $scope.$watch(
        function(){
            return ygUserPref.$storage.selectedServer;
        },
        function(newValue, oldValue){
        // console.log('Got you~!! ' + oldValue + ' --> ' + newValue);
            if(newValue in ygServer.servers){
                $scope.serverTitle = ygServer.servers[newValue].title;
                $scope.serverLogo = ygServer.servers[newValue].logo;
            }
            else{
                $scope.serverTitle = '請選擇站點';
                $scope.serverLogo = '';            
            }
    });

    $scope.openSidenav = function(){
        $mdSidenav('sidenav-left').open();
    };    
}]);