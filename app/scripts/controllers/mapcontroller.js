'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', 'uiGmapGoogleMapApi', '$mdDialog', 'ygError', 'ygProgress', 'ygUtils', 'ygUserPref', 'ygServer',
function($scope, uiGmapGoogleMapApi, $mdDialog, ygError, ygProgress, ygUtils, ygUserPref, ygServer) {

    $scope.map = ygUserPref.map;
    $scope.filterCircle = ygUserPref.filterCircle;

    $scope.posts = [];
    $scope.newPost = null;
    $scope.mapIsReady = false;
    $scope.mapEvents = {};
    $scope.infoWindowTemplateUrl = 'views/infowindow.html';

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

    $scope.filterCircleEvents = {
        center_changed: function (circle, eventName, model) {
            $scope.reloadPosts();
        },
        radius_changed: function (circle, eventName, model) {
            $scope.reloadPosts();
        }
    };

    $scope.popStoryEditor = function () {
        if($scope.newPost === null){
            $scope.newPost = new ygServer.postResource();
            // $scope.newPost.title = '';
            // $scope.newPost.context = '';
            // $scope.newPost.author = '';
            $scope.newPost.icon = 'images/googlemap-marker-green-32.png';
        }
        $scope.newPost['latitude'] = $scope.clickedMarker.coords.latitude;
        $scope.newPost['longitude'] = $scope.clickedMarker.coords.longitude;
        // console.log($scope.newPost);
        $mdDialog.show({
            templateUrl: 'views/posteditor.html',
            controller: 'PostEditorController',
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
        })
        .then(function(data){
            if(ygServer.postResource !== null){
                var promise = $scope.newPost.$save()
                .then(function (result) {
                        console.log('Success, post added!!');
                        $scope.newPost.show = true;
                        $scope.newPost.events = {
                            click: $scope.onClickPostMarker
                        };
                        if(!('icon' in $scope.newPost) || !($scope.newPost.icon)){
                            $scope.newPost.icon = 'images/icon-chat-48.png';
                        }
                        $scope.posts.push($scope.newPost);
                        $scope.newPost = null;
                        $scope.clickedMarker.options.visible = false;
                    }, function (error) {
                        console.log('BoooooooM~!!!, adding post failed');
                });
                // console.log(promise);

                ygProgress.show('新增資料...', promise);

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
            clickOutsideToClose: true,
            locals: {
                postID: model.id
            }
        })
        .then(function(response){}, function(response){});
    };

    $scope.reloadPosts = function(){
        if(ygServer.postResource === null){
            console.log("Post resource is null, maybe not connected to server?");
            return false;
        }
        var extraParams = {};
        // console.log($scope.filterCircle.visible);
        if($scope.filterCircle.visible){
            extraParams.filterCircle = {
                center: $scope.filterCircle.center,
                radius: $scope.filterCircle.radius
            };
        }
        $scope.posts = ygServer.postResource.getMarkers(extraParams, function(){
            for (var i = 0; i < $scope.posts.length; i++) {
                // $scope.posts[i].show = true;
                $scope.posts[i].events = {
                    click: $scope.onClickPostMarker
                };

                $scope.posts[i].templateUrl = $scope.infoWindowTemplateUrl;
                $scope.posts[i].showWindow = false;
                $scope.posts[i].infoWindowOptions = {
                    disableAutoPan: true
                };
                // $scope.posts[i].onClickCloseWindow = function () {
                //     console.log('Close me!! info window');
                //     $event.stopPropagation();
                // };
                // $scope.posts[i].templateParameter = {
                //     id: $scope.posts[i].id,
                //     title: $scope.posts[i].title
                // };
                if(!('icon' in $scope.posts[i]) || !($scope.posts[i].icon)){
                    $scope.posts[i].icon = 'images/icon-chat-48.png';
                }
            }
        });
    }

    $scope.mapEvents.click = function (googleMaps, eventName, args){
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
        if(ygUserPref.autoGeolocation){
            $scope.centerGeoLocation($scope.map);
        }
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
