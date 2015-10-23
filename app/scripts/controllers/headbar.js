'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:HeadbarCtrl
 * @description
 * # HeadbarCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('HeadBarController', ['$scope', '$mdSidenav', '$mdDialog', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygFilter', 'ygAudio', 'ygUtils',
function($scope, $mdSidenav, $mdDialog, ygUserPref, ygUserCtrl, ygServer, ygFilter, ygAudio, ygUtils){
    var self = this;

    $scope.userPref = ygUserPref.$storage;
    $scope.myPostsOptions = ygUserPref.myPostsOptions;
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
        },
        'my-posts': {
            fontIcon: 'person'
        }
    };
    $scope.selectedTool = "address";
    $scope.selectTool = function (toolName) {
        $scope.selectedTool = toolName;
    };

    $scope.iconSet = {};
    ygServer.initialPromises.updateServers.then(function () {
        $scope.$watch(
        function(){
            return ygServer.selectedServer;
        },
        function(){
            if(angular.isUndefined(ygServer.selectedServer) || ygServer.selectedServer === null){
                $scope.server = {title: '請選擇電台', logo: 'https://cdn0.iconfinder.com/data/icons/octicons/1024/radio-tower-128.png'};
            }
            else{
                $scope.server = ygServer.selectedServer;
            }
        });
    });

    $scope.showServerIntro = ygServer.showServerIntro;

    $scope.iconCtrls = ygUserCtrl.iconCtrls;
    $scope.iconCount = ygUserCtrl.iconCount;
    $scope.$watch(function () {
        return ygUserCtrl.iconCount;
    }, function () {
        $scope.iconCount = ygUserCtrl.iconCount;
    });

    $scope.toggleIcon = function (name) {
        $scope.iconCtrls[name].show = !($scope.iconCtrls[name].show);
        ygAudio.play('toggleIconCtrl');
        // console.log(ygUserCtrl.iconCtrls);
    };

    $scope.openIconCtrl = function () {
        $mdDialog.show({
            controller: 'IconCtrlController',
            templateUrl: 'views/icon-ctrl.html',
            clickOutsideToClose: true
        });
    };

    $scope.openSidenav = function(){
        $mdSidenav('sidenav-left').open();
    };

    $scope.openPostList = function () {
        ygUserCtrl.openPostList = !(ygUserCtrl.openPostList);
    };
    $scope.styleOfViewListButton = ygUserCtrl.openPostList ? {color: 'white'} : {color: 'lightgrey'};
    $scope.$watch(function () {
        return ygUserCtrl.openPostList;
    }, function () {
        $scope.styleOfViewListButton = ygUserCtrl.openPostList ? {color: 'white'} : {color: 'lightgrey'};    
    });

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
    };

    $scope.unselectMyPostsOptions = function () {
        $scope.userPref.filters.myPosts = undefined;
    };

    $scope.datePickerText = '請選擇日期';
    $scope.create_time = {};
    if('create_time' in ygUserPref.$storage.filters &&
    'startDate' in ygUserPref.$storage.filters.create_time &&
    'endDate' in ygUserPref.$storage.filters.create_time){
        $scope.create_time = {
            startDate: new Date(ygUserPref.$storage.filters.create_time.startDate),
            endDate: new Date(ygUserPref.$storage.filters.create_time.endDate)
        };
        $scope.datePickerText = ygUtils.formatDate($scope.create_time.startDate) + ' ~ ' + ygUtils.formatDate($scope.create_time.endDate);
    }

    $scope.openDatePicker = function () {
        $mdDialog.show({
            controller: 'DatePickerController',
            templateUrl: 'views/date-picker.html',
            locals: {
                create_time: $scope.create_time
            },
            clickOutsideToClose: true
        }).then(function (dates) {
            $scope.create_time.startDate = dates.startDate;
            $scope.create_time.endDate = dates.endDate;
            if(!('create_time' in ygUserPref.$storage.filters)){
                ygUserPref.$storage.filters.create_time = {};
            }
            ygUserPref.$storage.filters.create_time.startDate = dates.startDate.toString();
            ygUserPref.$storage.filters.create_time.endDate = dates.endDate.toString();
            $scope.datePickerText = ygUtils.formatDate($scope.create_time.startDate) + ' ~ ' + ygUtils.formatDate($scope.create_time.endDate);
        });
    };

    $scope.clearDateFilter = function () {
        $scope.create_time = {};
        if('create_time' in ygUserPref.$storage.filters){
            delete ygUserPref.$storage.filters.create_time;
        }
        $scope.datePickerText = '請選擇日期';
    };
}]);