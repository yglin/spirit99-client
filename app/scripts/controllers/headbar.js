'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:HeadbarCtrl
 * @description
 * # HeadbarCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('HeadBarController', ['$scope', '$mdSidenav', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygFilter', 'ygAudio',
function($scope, $mdSidenav, ygUserPref, ygUserCtrl, ygServer, ygFilter, ygAudio){
    var self = this;

    $scope.keywords = ygUserPref.$storage.filters.title.keywords;
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
        },
        period: {
            fontIcon: 'access_time'
        }
    };
    $scope.selectedTool = "search";
    $scope.selectTool = function (toolName) {
        $scope.selectedTool = toolName;
    };

    $scope.create_time = {
        startDate: new Date(ygUserPref.$storage.filters.create_time.startDate),
        endDate: new Date(ygUserPref.$storage.filters.create_time.endDate)
    };


    $scope.iconSet = {};
    ygServer.initialPromises.updateServers.then(function () {
        $scope.serverTitle = ygServer.selectedServer.title;
        $scope.serverLogo = ygServer.selectedServer.logo;

        $scope.$watch(
            function(){
                return ygServer.selectedServer;
            },
            function(newValue, oldValue){
            // console.log('Got you~!! ' + oldValue + ' --> ' + newValue);
                if('title' in ygServer.selectedServer){
                    $scope.serverTitle = ygServer.selectedServer.title;
                    $scope.serverLogo = ygServer.selectedServer.logo;
                    // $scope.iconSet = ygServer.servers[newValue].iconSet;
                }
                else{
                    $scope.serverTitle = '請選擇電台';
                    $scope.serverLogo = '';            
                }
        });

    });

    $scope.iconCtrls = ygUserCtrl.iconCtrls;

    $scope.toggleIcon = function (name) {
        $scope.iconCtrls[name].show = !($scope.iconCtrls[name].show);
        ygAudio.toggleIconCtrl.play();
        // console.log(ygUserCtrl.iconCtrls);
    };

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

    $scope.$watch('create_time.startDate', function (newValue) {
        ygUserPref.$storage.filters.create_time.startDate = newValue.toString();
    });

    $scope.$watch('create_time.endDate', function (newValue) {
        ygUserPref.$storage.filters.create_time.endDate = newValue.toString();
    });

    $scope.nextGeocodeLocation = function () {
        ygUserCtrl.geocode.currentIndex = (ygUserCtrl.geocode.currentIndex + 1) % ygUserCtrl.geocode.results.length;
    };

}]);