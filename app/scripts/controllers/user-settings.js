'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:UserSettingsCtrl
 * @description
 * # UserSettingsCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('UserSettingsController', ['$scope', '$mdDialog', 'ygUserPref', 'ygFollowPost',
function ($scope, $mdDialog, ygUserPref, ygFollowPost) {
    $scope.settings = ygUserPref.$storage;
    $scope.unfollowAllPosts = function () {
        $mdDialog.show(
            $mdDialog.confirm()
            .title('停止追蹤文章')
            .content('確定要停止追蹤目前追蹤中的所有文章？')
            .ok('確定')
            .cancel('我按錯了')
        ).then(function () {
            // console.log('followedPosts go die~!!');
            for(var post_id in ygFollowPost.followedPosts){
                delete ygFollowPost.followedPosts[post_id];
            }
            // console.log(ygFollowPost.followedPosts);
        });
    };

    $scope.setMapHome = function () {
        $mdDialog.show(
            $mdDialog.confirm()
            .title('設定地區首頁')
            .content('將目前所瀏覽的地區範圍，設定為每次開啟網站時，地圖固定會顯示的範圍？')
            .ok('確定')
            .cancel('我按錯了')
        ).then(function () {
            $scope.settings.startUpAtMap = 'useMapHome';
            ygUserPref.setMapHome();
            // console.log(ygUserPref.$storage.mapHome);
        });
    };
}]);