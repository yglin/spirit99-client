'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostEditorController', ['$scope', '$mdDialog', '$window', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygFroala', 'newPost',
function ($scope, $mdDialog, $window, ygUserPref, ygUserCtrl, ygServer, ygFroala, newPost){    

    ygFroala.getFroalaOptions().then(function(options){
        $scope.froalaOptions = options;
        $scope.froalaOptions.minHeight = 150;
    });
    
    $scope.newPost = newPost;

    if(angular.isUndefined($scope.newPost.context)){
        $scope.newPost.context = '';
    }

    $scope.iconCtrls = ygUserCtrl.iconCtrls;

    if(!($scope.newPost.icon in $scope.iconCtrls)){
        $scope.newPost.icon = Object.keys($scope.iconCtrls)[0];
    }

    $scope.triggerToolbar = function(){
        $scope.froalaOptions.froala('show', null);
    };

    $scope.insertImage = function(){
        $scope.froalaOptions.froala('show', null);
        $scope.froalaOptions.froala('showInsertImage');
    };

    $scope.selectMarkerIcon = function (iconName) {
        $scope.newPost.icon = iconName;
    };

    $scope.cancel = function() {
        $mdDialog.cancel($scope.newPost);
    };

    $scope.post = function(){
        $mdDialog.hide($scope.newPost);
    };

    $scope.statisticResource = ygServer.getSupportStatistic();
    if($scope.statisticResource){
        $scope.newStatistic = new $scope.statisticResource({
            expression: '言贊',
            count: 0
        });
        $scope.newStatisticCount = 0;
        $scope.addNewStatistic = function () {
            if(!('newStatistics' in $scope.newPost)){
                $scope.newPost.newStatistics = {};
            }
            $scope.newStatisticCount += 1;
            $scope.newPost.newStatistics[$scope.newStatisticCount] = $scope.newStatistic;
            $scope.newStatistic = new $scope.statisticResource({
                expression: '言贊',
                count: 0
            });
        };
        $scope.removeNewStatistic = function (key) {
            delete $scope.newPost.newStatistics[key];
        };

        $scope.removeStatistic = function (stat_id, event) {
            var statistic = $scope.newPost.statistics[stat_id];

            var this_dialog = angular.element('#post-editor-dialog');

            if(!ygUserPref.isMyPost($scope.newPost)){
                $window.alert('無法刪除，找不到密碼或密碼錯誤，這可能不是你的文章喔');
            }
            else{
                if($window.confirm('刪除 ' + statistic.expression + ' 按鈕及資料: 有' + statistic.count + '人說 ' + statistic.expression)){
                    $scope.newPost.statistics[stat_id].tobeDeleted = true;
                }
            }
        };
    }
}]);
