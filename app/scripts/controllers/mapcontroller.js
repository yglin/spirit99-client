'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', '$mdDialog', 'ygError', 'ygProgress', 'ygUtils', 'ygUserPref', 'ygPost', '$timeout',
function($scope, uiGmapGoogleMapApi, $mdDialog, ygError, ygProgress, ygUtils, ygUserPref, ygPost, $timeout) {

// uiGmapGoogleMapApi is a promise.
// The "then" callback function provides the google.maps object.
uiGmapGoogleMapApi.then(function(googlemaps) {

    $scope.mapIsReady = false;

    $scope.map = ygUserPref.$storage.map;
    $scope.filterCircle = ygUserPref.$storage.filterCircle;

    $scope.newPost = null;
    $scope.mapEvents = {};

    console.log($scope.clickedMarker);
    $scope.posts = ygPost.posts;

    $scope.clickedMarker = {
        id: 'spirit99-map-clicked-marker',
        coords: {
            latitude: 23.973875,
            longitude: 120.982024
        },
        // show: true,
        options: {
            icon: 'images/icon-question-48.png',
            visible: false
        },
        events: {
        }
    };

    $scope.infoWindow = {
        coords: {
            latitude: 23.973875,
            longitude: 120.982024
        },
        show: false,
        templateUrl: 'views/infowindow.html',
        templateParameter: {},
        closeClick: function () {
            $scope.infoWindow.show = false;
        },
        options: {
            pixelOffset: new googlemaps.Size(0, -40),
            maxWidth: 150
        }
    };

    $scope.filterCircleEvents = {
        center_changed: function (circle, eventName, model) {
            $scope.reloadPosts();
        },
        radius_changed: function (circle, eventName, model) {
            $scope.reloadPosts();
        }
    };

    $scope.onClickPostMarker = function (marker, eventName, model) {
        $mdDialog.show({
            templateUrl: 'views/post.html',
            controller: 'PostController',
            clickOutsideToClose: true,
            locals: {
                postID: model.id
            }
        })
        .then(function(response){}, function(response){});
    };

    $scope.onMouseoverPostMarker = function (marker, eventName, model) {
        $scope.infoWindow.coords = {
            latitude: model.latitude,
            longitude: model.longitude
        };
        $scope.infoWindow.templateParameter = model;
        $scope.infoWindow.show = true;
        $timeout.cancel($scope.timeoutCloseInfoWindow);
        $scope.timeoutOpenListPosts = $timeout(function () {
            ygUserPref.$storage.openListPosts = true;
        }, 2000);
    };

    $scope.onMouseoutPostMarker = function (marker, eventName, model) {
        $scope.delayCloseInfoWindow = true;
        $scope.timeoutCloseInfoWindow = $timeout(function () {
            $scope.infoWindow.show = false;
        }, 1000);
        $timeout.cancel($scope.timeoutOpenListPosts);
    };

    $scope.postMarkerEvents = {
        click: $scope.onClickPostMarker,
        mouseover: $scope.onMouseoverPostMarker,
        mouseout: $scope.onMouseoutPostMarker
    };

    $scope.mapEvents.click = function (googleMaps, eventName, args){
        $scope.clickedMarker.coords = {
            latitude: args[0].latLng.lat(),
            longitude: args[0].latLng.lng()
        };
        $scope.clickedMarker.options.visible = true;
        ygPost.popStoryEditor(args[0].latLng.lat(), args[0].latLng.lng())
        .then(function () {
            $scope.clickedMarker.options.visible = false;
        });
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

    if(ygUserPref.$storage.autoGeolocation){
        $scope.centerGeoLocation($scope.map);
    }

    $scope.mapIsReady = true;    

});

}]);
