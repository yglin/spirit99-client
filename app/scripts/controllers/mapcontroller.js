'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', '$mdDialog', 'ygError', 'ygProgress', 'ygServer',
function($scope, uiGmapGoogleMapApi, $mdDialog, ygError, ygProgress, ygServer) {

    $scope.posts = [];
    $scope.mapIsReady = false;
    $scope.map = {
        center:{
            latitude: 23.973875,
            longitude: 120.982024
        },
        zoom: 6,
        events: {
        }
    };

    $scope.clickedMarker = {
        id: 'spirit99-map-clicked-marker',
        coords: {
            latitude: 23.973875,
            longitude: 120.982024
        },
        // show: false,
        options: {
            icon: 'images/icon-question-48.png',
            visible: false
        },
        events: {
        }
    };

    $scope.popStoryEditor = function () {
        $mdDialog.show({
            templateUrl: 'views/posteditor.html',
            controller: 'PostEditorController',
            parent: angular.element(document.body)
        })
        .then(function(data){
            data['latitude'] = $scope.clickedMarker.coords.latitude;
            data['longitude'] = $scope.clickedMarker.coords.longitude;
            if(ygServer.postResource !== null){
                var promise = ygServer.postResource.save(data).$promise;
                ygProgress.show('新增資料...',
                    promise.then(function (result) {
                        console.log('Success, post added!!');
                        $scope.reloadPosts();
                        $scope.clickedMarker.options.visible = false;
                    }, function (error) {
                        console.log('BoooooooM~!!!, adding post failed');
                }));
            }else{
                console.log('Not connected to post resources');
            }
        }, function(){
            console.log('你又按錯啦你');
        });
    };

    $scope.onClickPostMarker = function (marker, eventName, model) {
        $mdDialog.show({
            templateUrl: 'views/post.html',
            controller: 'PostController',
            clickOutsideToClose: true
        })
        .then(function(response){}, function(response){});
    };

    $scope.reloadPosts = function(){
        if(ygServer.postResource !== null){
            $scope.posts = ygServer.postResource.query(function(){
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.posts[i].show = true;
                    $scope.posts[i].events = {
                        click: $scope.onClickPostMarker
                    };
                    if(!('icon' in $scope.posts[i]) || !($scope.posts[i].icon)){
                        $scope.posts[i].icon = 'images/icon-chat-48.png';
                    }
                }
            });
        }
        else{
            console.log("Post resource is null, maybe not connected to server?");
        }
    }

    $scope.map.events.click = function (googleMaps, eventName, args){
        $scope.clickedMarker.coords = {
            latitude: args[0].latLng.lat(),
            longitude: args[0].latLng.lng()
        };
        $scope.clickedMarker.options.visible = true;
        $scope.popStoryEditor();
    };

    $scope.clickedMarker.events.click = function (marker, eventName, model) {
        $scope.popStoryEditor();
    };

    // Center map at user's current location
    $scope.centerGeoLocation = function(map, zoom){
        zoom = typeof zoom !== 'undefined' ? zoom : 15;
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                map.center = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                map.zoom = zoom;
                $scope.$apply();
            });
        }
    };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.centerGeoLocation($scope.map);
        $scope.mapIsReady = true;    
    });

    // $watch-es
    $scope.$watch(function () {
        return ygServer.postResource;
    }, function (newValue, oldValue) {
        if(ygServer.postResource !== null){
            $scope.reloadPosts();
        }
    });

}]);
