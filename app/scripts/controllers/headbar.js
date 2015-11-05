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

    if(!('title' in ygUserCtrl.filters)){
        ygUserCtrl.filters.title = {
            keywords: []
        };
    }
    if(!('myPostsOption' in ygUserCtrl.filters)){
        ygUserCtrl.filters.myPostsOption = null;
    }
    $scope.filters = ygUserCtrl.filters;
    $scope.myPostsOptions = ygUserCtrl.myPostsOptions;

    $scope.tools = {
        search: {
            tooltip: '搜尋標題',
            fontIcon: 'search'
        },
        address: {
            tooltip: '搜尋地址',
            fontIcon: 'my_location'
        },
        markers: {
            tooltip: '顯示／隱藏地圖標示',
            fontIcon: 'place'
        },
        period: {
            tooltip: '搜尋文章發佈時間',
            fontIcon: 'access_time'
        },
        'my-posts': {
            tooltip: '我的。。。文章',
            fontIcon: 'person'
        }
    };
    $scope.selectedTool = "address";
    $scope.isShowFabActions = false;
    $scope.showFabActions = function () {
        $scope.isShowFabActions = true;
    };
    $scope.hideFabActions = function () {
        $scope.isShowFabActions = false;
    };
    $scope.selectTool = function (toolName) {
        $scope.selectedTool = toolName;
        $scope.hideFabActions();
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
        $scope.filters.myPostsOption = null;
    };

    $scope.datePickerText = '請選擇日期';
    $scope.create_time = {};
    if('create_time' in ygUserCtrl.filters &&
    'startDate' in ygUserCtrl.filters.create_time &&
    'endDate' in ygUserCtrl.filters.create_time){
        $scope.create_time = {
            startDate: new Date(ygUserCtrl.filters.create_time.startDate),
            endDate: new Date(ygUserCtrl.filters.create_time.endDate)
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
            if(!('create_time' in ygUserCtrl.filters)){
                ygUserCtrl.filters.create_time = {};
            }
            ygUserCtrl.filters.create_time.startDate = dates.startDate.toString();
            ygUserCtrl.filters.create_time.endDate = dates.endDate.toString();
            $scope.datePickerText = ygUtils.formatDate($scope.create_time.startDate) + ' ~ ' + ygUtils.formatDate($scope.create_time.endDate);
        });
    };

    $scope.clearDateFilter = function () {
        $scope.create_time = {};
        if('create_time' in ygUserCtrl.filters){
            delete ygUserCtrl.filters.create_time;
        }
        $scope.datePickerText = '請選擇日期';
    };
}]);