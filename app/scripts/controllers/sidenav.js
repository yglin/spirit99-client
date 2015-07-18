'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:SidenavCtrl
 * @description
 * # SidenavCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('SideNavController', ['$scope', function($scope){
    $scope.selectedPane = 'server-list';
    $scope.switchPane = function(paneName){
        $scope.selectedPane = paneName;
    };
}]);