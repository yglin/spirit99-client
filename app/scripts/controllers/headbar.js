'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:HeadbarCtrl
 * @description
 * # HeadbarCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('HeadBarController', ['$scope', '$rootElement', '$mdSidenav', '$mdDialog', 'ygToastTip', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygFilter', 'ygAudio', 'ygUtils',
function($scope, $rootElement, $mdSidenav, $mdDialog, ygToastTip, ygUserPref, ygUserCtrl, ygServer, ygFilter, ygAudio, ygUtils){
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
            fontIcon: 'search',
            hints: ['輸入搜尋關鍵字後按Enter', '多個關鍵字的搜尋效果會累加'],
            hintIndex: 0
        },
        address: {
            tooltip: '搜尋地址',
            fontIcon: 'my_location',
            hints: ['輸入地名或地址後按Enter', '點<i class="material-icons">swap_horiz</i>按鈕，切換多個搜尋的地點結果'],
            hintIndex: 0
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

    $scope.showToolHint = function (toolName) {
        if(toolName in $scope.tools && 'hints' in $scope.tools[toolName]){
            $scope.showToastTip($scope.tools[toolName].hints[$scope.tools[toolName].hintIndex]);
            $scope.tools[toolName].hintIndex = ($scope.tools[toolName].hintIndex + 1) % $scope.tools[toolName].hints.length;
        }
    };

    $scope.selectTool = function (toolName) {
        $scope.selectedTool = toolName;
        $scope.showToolHint(toolName);
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

    self.mapHints = [
        '點 <i class="material-icons">menu</i> 開啟電台及設定面板',
        '點電台標題來顯示電台簡介',
        '點<md-button class="md-fab md-mini"></md-button>可切換快速工具',
        '點 <i class="material-icons">view_list</i> 開啟文章列表'
    ];
    self.mapHintsIndex = 0;
    $scope.showToastTip = function (content) {
        if(content){
            ygToastTip.showToastTip(content);
        }else{
            ygToastTip.showToastTip(self.mapHints[self.mapHintsIndex]);
            self.mapHintsIndex = (self.mapHintsIndex + 1) % self.mapHints.length;        
        }
    };
}]);