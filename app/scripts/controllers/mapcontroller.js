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
            data['latitude'] = $scope.clickedMarker.coords.latitude;
            data['longitude'] = $scope.clickedMarker.coords.longitude;
            if(ygServer.postResource !== null){
                var promise = ygServer.postResource.save(data).$promise;
                ygProgress.show('新增資料...',
                    promise.then(function (result) {
                        console.log('Success, post added!!');
                        $scope.reloadPosts();
                    }, function (error) {
                        console.log('BoooooooM~!!!, adding post failed');
                }));
            }else{
                console.log('Not connected to post resources');
            }
        }, function(){
            console.log('你又按錯啦');
        });
    };

    $scope.posts = [];
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

    $scope.reloadPosts = function(){
        if(ygServer.postResource !== null){
            $scope.posts = ygServer.postResource.query(function(){
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.posts[i].show = true;
                }
            });
        }
        else{
            console.log("Post resource is null, maybe not connected to server?");
        }
    }

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
