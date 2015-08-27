'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$mdDialog', 'ygError', 'ygProgress', 'ygUtils', 'ygUserPref', 'ygUserCtrl', 'ygPost', '$timeout',
function($scope, uiGmapGoogleMapApi, uiGmapIsReady, $mdDialog, ygError, ygProgress, ygUtils, ygUserPref, ygUserCtrl, ygPost, $timeout) {

// uiGmapGoogleMapApi is a promise.
// The "then" callback function provides the google.maps object.
uiGmapGoogleMapApi.then(function(googlemaps) {

    $scope.mapIsReady = false;

    $scope.map = ygUserPref.$storage.map;
    $scope.filterCircle = ygUserPref.$storage.filterCircle;

    $scope.newPost = null;
    $scope.mapEvents = {};
    $scope.isMouseOverMap = false;

    // console.log($scope.clickedMarker);
    $scope.posts = [];
    $scope.$watch(function () {
        return ygPost.posts;
    }, function (newValue, oldValue) {
        if(Array.isArray(newValue)){
            $scope.posts = newValue;
        }
    });

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
            maxWidth: 250
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
        ygPost.showPostDetail(model.id);
    };

    $scope.onMouseoverPostMarker = function (marker, eventName, model) {
        $scope.infoWindow.coords = {
            latitude: model.latitude,
            longitude: model.longitude
        };
        $scope.infoWindow.templateParameter = model;
        $scope.infoWindow.show = true;
        ygUserCtrl.focusedPostId = model.id;
        $timeout.cancel($scope.timeoutCloseInfoWindow);
        $scope.timeoutOpenListPosts = $timeout(function () {
            ygUserCtrl.openListPosts = true;
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

    $scope.mapEvents.mouseover = function (googleMaps, eventName, args) {
        $scope.isMouseOverMap = true;
    };

    $scope.mapEvents.mouseout = function (googleMaps, eventName, args) {
        $scope.isMouseOverMap = false;
    };

    // $scope.mapEvents.bounds_changed = function (googleMaps, eventName, args) {
    //     console.log(googleMaps.getBounds().toString());
    // };

    $scope.$watch(function () {
        return ygUserCtrl.focusedPostId;
    }, function(newValue, oldValue){
        if(!$scope.isMouseOverMap){
            var post = ygPost.indexedPosts[ygUserCtrl.focusedPostId];
            if(post){
                $scope.infoWindow.coords = {
                    latitude: post.latitude,
                    longitude: post.longitude
                };
                $scope.infoWindow.templateParameter = post;
                $scope.infoWindow.show = true;
                $scope.map.center = {
                    latitude: post.latitude,
                    longitude: post.longitude                    
                };
            }
        }
    });

    $scope.mapIsReady = true;    

});

}]);
