'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostEditorController', ['$scope', '$mdDialog', '$window', 'ygMyPost', 'ygUserCtrl', 'ygServer', 'ygFroala', 'newPost',
function ($scope, $mdDialog, $window, ygMyPost, ygUserCtrl, ygServer, ygFroala, newPost){    

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

    $scope.voteResource = ygServer.getSupportVote();
    if($scope.voteResource){
        $scope.newVote = new $scope.voteResource({
            expression: '言贊',
            count: 0
        });
        $scope.newVoteCount = 0;
        $scope.addNewVote = function () {
            if(!('newVotes' in $scope.newPost)){
                $scope.newPost.newVotes = {};
            }
            $scope.newVoteCount += 1;
            $scope.newPost.newVotes[$scope.newVoteCount] = $scope.newVote;
            $scope.newVote = new $scope.voteResource({
                expression: '言贊',
                count: 0
            });
        };
        $scope.removeNewVote = function (key) {
            delete $scope.newPost.newVotes[key];
        };

        $scope.removeVote = function (stat_id, event) {
            var vote = $scope.newPost.votes[stat_id];

            var this_dialog = angular.element('#post-editor-dialog');

            if(!ygMyPost.isMyPost($scope.newPost)){
                $window.alert('無法刪除，找不到密碼或密碼錯誤，這可能不是你的文章喔');
            }
            else{
                if($window.confirm('刪除 ' + vote.expression + ' 按鈕及資料: 有' + vote.count + '人說 ' + vote.expression)){
                    $scope.newPost.votes[stat_id].tobeDeleted = true;
                }
            }
        };
    }
}]);
