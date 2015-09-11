'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostEditorController', ['$scope', '$mdDialog', 'ygUserPref', 'ygUserCtrl', 'newPost',
function ($scope, $mdDialog, ygUserPref, ygUserCtrl, newPost){    
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
    }

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
}]);
