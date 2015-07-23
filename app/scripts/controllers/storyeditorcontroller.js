'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('StoryEditorController', ['$scope', '$mdDialog', 'ygServer', function ($scope, $mdDialog, ygServer){    
    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 150,
        language: 'zh-tw',
        placeholder: '內文...'
    };

    var server = ygServer.servers[ygServer.currentServerName];

    $scope.title = '';
    $scope.context = '';
    $scope.author = '';


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
        $mdDialog.cancel();
    };

    $scope.post = function(){
        $mdDialog.hide($scope.context);
    };
}]);
