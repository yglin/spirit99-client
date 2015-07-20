'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:StoryeditorcontrollerCtrl
 * @description
 * # StoryeditorcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('StoryEditorController', ['$scope', '$mdDialog', function ($scope, $mdDialog){
    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 150,
        placeholder: '很久很久以前...'
    };
    $scope.title = '';
    $scope.context = '';
    $scope.author = '';

    $scope.triggerToolbar = function(){
        $scope.froalaOptions.froala('show', null);
        // $scope.froalaOptions.inlineMode = !($scope.froalaOptions.inlineMode);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.post = function(){
        $mdDialog.hide($scope.context);
    }
}]);
