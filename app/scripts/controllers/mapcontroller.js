'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', '$mdDialog', 'ygServer', function($scope, uiGmapGoogleMapApi, $mdDialog, ygServer) {
    $scope.onClickMap = function(googleMaps, eventName, args){
        $scope.clickedMarker.coords = {
            latitude: args[0].latLng.lat(),
            longitude: args[0].latLng.lng()
        };
        $scope.clickedMarker.options.visible = true;
        $mdDialog.show({
            templateUrl: 'views/StoryEditor.html',
            controller: 'StoryEditorController',
            parent: angular.element(document.body)
        })
        .then(function(data){
            data['coords'] = $scope.clickedMarker.coords;
            ygServer.postServer(data);
        }, function(){
            console.log('你又按錯啦');
        });
        $scope.$apply();
    };

    $scope.mapIsReady = false;
    $scope.map = {
        center:{
            latitude: 23.973875,
            longitude: 120.982024
        },
        zoom: 6,
        events: {
            click: $scope.onClickMap
        }
    };
    $scope.clickedMarker = {
        create: false,
        id: 'spirit99-map-clicked-marker',
        coords: {
            latitude: 23.973875,
            longitude: 120.982024
        },
        // show: false,
        options: {
            visible: false
        },
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

}]);
