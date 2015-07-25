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
    $scope.iconSet = server.markerIconSet;
    $scope.selectedIconUrl = 'images/googlemap-marker-green-32.png';
    $scope.title = '';
    $scope.context = '';
    $scope.author = '';

    $scope.selectMarkerIcon = function (iconUrl) {
        $scope.selectedIconUrl = iconUrl;
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
        $mdDialog.cancel();
    };

    $scope.post = function(){
        var postData = {
            title: $scope.title,
            author: $scope.author,
            context: $scope.context,
            icon: $scope.selectedIconUrl
        };
        $mdDialog.hide(postData);
    };
}]);
