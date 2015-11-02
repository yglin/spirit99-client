'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:SearchpaneCtrl
 * @description
 * # SearchpaneCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('SearchPaneController', ['$scope', 'ygUserPref',
function($scope, ygUserPref){
    $scope.keywords = ygUserCtrl.filters.title;
}]);