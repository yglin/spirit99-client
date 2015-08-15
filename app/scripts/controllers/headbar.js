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
    $scope.showInfoWindows = false;
    $scope.toogleInfoWindowsButtonStyle = {color: 'white'};
    $scope.toogleInfoWindowsButtonTooltip = '顯示全部標題';

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

    $scope.toggleInfoWindows = function () {
        $scope.showInfoWindows = !($scope.showInfoWindows);
        if($scope.showInfoWindows){
            $scope.toogleInfoWindowsButtonStyle = {color: 'grey'};
            $scope.toogleInfoWindowsButtonTooltip = '隱藏全部標題';
        }
        else{
            $scope.toogleInfoWindowsButtonStyle = {color: 'white'};
            $scope.toogleInfoWindowsButtonTooltip = '顯示全部標題';
        }
    };
}]);