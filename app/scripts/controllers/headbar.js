'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:HeadbarCtrl
 * @description
 * # HeadbarCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('HeadBarController', ['$scope', '$mdSidenav', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygFilter',
function($scope, $mdSidenav, ygUserPref, ygUserCtrl, ygServer, ygFilter){
    var self = this;

    $scope.keywords = ygUserPref.$storage.filters.title;
    // $scope.showInfoWindows = false;
    // $scope.toogleInfoWindowsButtonStyle = {color: 'white'};
    // $scope.toogleInfoWindowsButtonTooltip = '顯示全部標題';
    $scope.tools = {
        search: {
            fontIcon: 'search' 
        },
        address: {
            fontIcon: 'my_location'
        },
        markers: {
            fontIcon: 'place'
        }
    }
    $scope.selectTool = function (toolName) {
        $scope.selectedTool = toolName;
    }
    $scope.selectTool('search');

    $scope.iconSet = {};
    ygServer.initialPromises['updateServers'].then(function () {
        $scope.serverTitle = ygServer.servers[ygUserPref.$storage.selectedServer].title;
        $scope.serverLogo = ygServer.servers[ygUserPref.$storage.selectedServer].logo;
        $scope.iconSet = ygServer.servers[ygUserPref.$storage.selectedServer].iconSet;

        $scope.$watch(
            function(){
                return ygUserPref.$storage.selectedServer;
            },
            function(newValue, oldValue){
            // console.log('Got you~!! ' + oldValue + ' --> ' + newValue);
                if(newValue in ygServer.servers){
                    $scope.serverTitle = ygServer.servers[newValue].title;
                    $scope.serverLogo = ygServer.servers[newValue].logo;
                    $scope.iconSet = ygServer.servers[newValue].iconSet;
                }
                else{
                    $scope.serverTitle = '請選擇站點';
                    $scope.serverLogo = '';            
                }
        });

    });

    ygUserCtrl.initialPromises['refreshIconCtrls'].then(function () {
        $scope.iconCtrls = ygUserCtrl.iconCtrls;
    });

    $scope.toggleIcon = function (name) {
        $scope.iconCtrls[name].show = !($scope.iconCtrls[name].show);
        // console.log(ygUserCtrl.iconCtrls);
    }

    $scope.openSidenav = function(){
        $mdSidenav('sidenav-left').open();
    };

    $scope.onEnterAddress = function (address) {
        // console.log('Navigate to ' + address);
        if(address.length > 0){
            ygUserCtrl.userAddress = address;
        }
    };

    $scope.isMultipleGeocodeLocations = false;
    $scope.$watch(function () {
        return ygUserCtrl.geocode.results.length;
    }, function (newValue) {
        if(newValue > 1){
            $scope.isMultipleGeocodeLocations = true;
        }
        else{
            $scope.isMultipleGeocodeLocations = false;            
        }
    });

    $scope.nextGeocodeLocation = function () {
        ygUserCtrl.geocode.currentIndex = (ygUserCtrl.geocode.currentIndex + 1) % ygUserCtrl.geocode.results.length;
    }

    // $scope.toggleInfoWindows = function () {
    //     $scope.showInfoWindows = !($scope.showInfoWindows);
    //     if($scope.showInfoWindows){
    //         $scope.toogleInfoWindowsButtonStyle = {color: 'grey'};
    //         $scope.toogleInfoWindowsButtonTooltip = '隱藏全部標題';
    //     }
    //     else{
    //         $scope.toogleInfoWindowsButtonStyle = {color: 'white'};
    //         $scope.toogleInfoWindowsButtonTooltip = '顯示全部標題';
    //     }
    // };
}]);