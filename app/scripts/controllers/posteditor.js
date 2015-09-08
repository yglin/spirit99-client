'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostEditorController', ['$scope', '$mdDialog', 'ygUserPref', 'ygServer', 'newPost',
function ($scope, $mdDialog, ygUserPref, ygServer, newPost){    
    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 150,
        language: 'zh-tw',
        placeholder: '內文...'
    };

    $scope.newPost = newPost;

    var selectedServer = ygServer.servers[ygUserPref.$storage.selectedServer];
    $scope.iconSet = selectedServer.iconSet;
    if(!($scope.newPost.icon in $scope.iconSet)){
        $scope.newPost.icon = Object.keys($scope.iconSet)[0];
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
