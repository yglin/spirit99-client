'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:PostcontrollerCtrl
 * @description
 * # PostcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('PostController', ['$scope', '$resource', '$mdDialog', 'ygUtils', 'ygServer', 'postID',
function ($scope, $resource, $mdDialog, ygUtils, ygServer, postID) {
    $scope.froalaOptions = {
        inlineMode: true,
        minHeight: 50,
        language: 'zh-tw',
        placeholder: '留言...'
    };
    $scope.formatDatetime = ygUtils.formatDatetime;

    var commentsResource = null;
    $scope.comments = [];

    $scope.postLoaded = false;
    ygServer.postResource.get({id:postID},
    function(result, getResponseHeaders){
        $scope.post = result;
        $scope.postLoaded = true;

        // Load comments
        var links = ygUtils.getHateoasLinks(getResponseHeaders());
        if('comments' in links){
            commentsResource = $resource(links['comments'] + '/:id');
            $scope.comments = commentsResource.query(
            function (results) {
            },
            function (error) {
                // body...
            });
        }
    },
    function(error){

    });


    $scope.newComment = {
        context: '',
        author: ''
    };

    $scope.addComment = function (comment) {
        
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
