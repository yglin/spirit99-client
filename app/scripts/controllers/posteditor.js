'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostEditorController', ['$scope', '$mdDialog', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'newPost',
function ($scope, $mdDialog, ygUserPref, ygUserCtrl, ygServer, newPost){    
    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 150,
        language: 'zh-tw',
        placeholder: '內文...'
    };

    $scope.newPost = newPost;

    $scope.iconCtrls = ygUserCtrl.iconCtrls;

    if(!($scope.newPost.icon in $scope.iconCtrls)){
        $scope.newPost.icon = Object.keys($scope.iconCtrls)[0];
    }

    $scope.selectMarkerIcon = function (iconName) {
        $scope.newPost.icon = iconName;
    };

    $scope.triggerToolbar = function(){
        $scope.froalaOptions.froala('show', null);
        // $scope.froalaOptions.inlineMode = !($scope.froalaOptions.inlineMode);
    };

    $scope.insertImage = function(){
        // console.log('Show Insert Image!!');
        $scope.froalaOptions.froala('show', null);
        $scope.froalaOptions.froala('showInsertImage');
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
            // console.log(this_dialog);

            // var noPasswordAlert = $mdDialog.alert().title('密碼錯誤')
            // .content().targetEvent(event)
            // .ariaLabel('密碼錯誤')
            // .ok('喔 好');

            if(!('password' in $scope.newPost)){
                alert('無法刪除，找不到密碼或密碼錯誤，這可能不是你的文章喔');
            }
            else{
                if(confirm('刪除 ' + statistic.expression + ' 按鈕及資料: 有' + statistic.count + '人說 ' + statistic.expression)){
                    $scope.newPost.statistics[stat_id].tobeDeleted = true;
                }
            }
        }
    }
}]);
