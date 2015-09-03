'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', '$timeout', 'uiGmapGoogleMapApi', 'ygInit', 'ygUtils', 'ygUserPref', 'ygUserCtrl', 'ygPost', 'ygAudio',
function($scope, $timeout, uiGmapGoogleMapApi, ygInit, ygUtils, ygUserPref, ygUserCtrl, ygPost, ygAudio) {

// uiGmapGoogleMapApi is a promise.
// The "then" callback function provides the google.maps object.
uiGmapGoogleMapApi.then(function(googlemaps) {

    $scope.mapIsReady = false;

    $scope.map = ygUserPref.$storage.map;
    $scope.filterCircle = ygUserPref.$storage.filterCircle;

    $scope.newPost = null;
    $scope.mapControl = {};
    $scope.mapEvents = {};

    // console.log($scope.clickedMarker);
    $scope.posts = ygPost.filteredPosts;
    $scope.posts.addAsMarker = function (postData) {
        // console.log('Add post marker ' + postData.id);
        $scope.addMarkerAnimation(postData, 2500);
        this.push(postData);
    };

    // $scope.markersOptions = {
    //     animation: googlemaps.Animation.BOUNCE
    // };

    $scope.clickedMarker = {
        id: 'spirit99-map-clicked-marker',
        coords: {
            latitude: 23.973875,
            longitude: 120.982024
        },
        // show: true,
        options: {
            icon: 'images/icon-question-48.png',
            visible: false,
            draggable: true
        },
        events: {
            click: function (argument) {
                ygPost.popStoryEditor().then(function (result) {
                    var markers = $scope.clickedMarker.control.getGMarkers();
                    if(markers.length >=1){
                        markers[0].setVisible(false);
                    }
                }, function (error) {
                    // body...
                });
            }
        },
        control: {}
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

    // $scope.filterCircleEvents = {
    //     center_changed: function (circle, eventName, model) {
    //         $scope.reloadPosts();
    //     },
    //     radius_changed: function (circle, eventName, model) {
    //         $scope.reloadPosts();
    //     }
    // };

    $scope.onClickPostMarker = function (marker, eventName, model) {
        ygPost.showPostDetail(model.id);
    };

    $scope.onMouseoverPostMarker = function (marker, eventName, model) {
        ygAudio.focusOnPost.play();
        $scope.infoWindow.coords = {
            latitude: model.latitude,
            longitude: model.longitude
        };
        $scope.infoWindow.templateParameter = model;
        $scope.infoWindow.show = true;
        ygUserCtrl.focusedPostId = model.id;
        $timeout.cancel($scope.timeoutCloseInfoWindow);
        if(!ygUserCtrl.openListPosts){
            $scope.timeoutOpenListPosts = $timeout(function () {
                ygUserCtrl.openListPosts = true;
            }, 2000);
        }
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


    $scope.onClickMap = function (googleMaps, eventName, args){
        // I have to use google.maps.Marker API to move the clickedMarker,
        // because somehow all bindings to the clickedMarker properties are lost after initialization 
        var markers = $scope.clickedMarker.control.getGMarkers();
        if(markers.length >=1){
            markers[0].setPosition(args[0].latLng);
            markers[0].setVisible(true);
        }

        $scope.clickedMarker.options.visible = true;
        ygPost.popStoryEditor(args[0].latLng.lat(), args[0].latLng.lng())
        .then(function (result) {
            if(markers.length >=1){
                markers[0].setVisible(false);
            }
        }, function (error) {
            // Do nothing...
        });
    };

    $scope.onDragendMap = function (googleMaps, eventName, args) {
        $timeout.cancel(this.promise);
        this.promise = $timeout(ygPost.loadPosts, 1000);
    };

    $scope.onZoomChangedMap = function (googleMaps, eventName, args) {
        $timeout.cancel(this.promise);
        this.promise = $timeout(ygPost.loadPosts, 1000);
    };

    $scope.onMouseOverMap = function (googleMaps, eventName, args) {
        ygUserCtrl.isMouseOverMap = true;
    };

    $scope.onMouseOutMap = function (googleMaps, eventName, args) {
        ygUserCtrl.isMouseOverMap = false;
    };

    $scope.mapEvents = {
        click: $scope.onClickMap,
        mouseover: $scope.onMouseOverMap,
        mouseout: $scope.onMouseOutMap,
        dragend: $scope.onDragendMap,
        zoom_changed: $scope.onZoomChangedMap
    };

    $scope.addMarkerAnimation = function (post, interval) {
        post.options = typeof post.options === 'undefined' ? {} : post.options;
        post.options.animation = googlemaps.Animation.BOUNCE;
        $timeout(function () {
            post.options.animation = null;
        }, interval);
    };
    // $scope.rectangleBounds = new googlemaps.LatLngBounds(
    //         new googlemaps.LatLng(24.084, 120.551),
    //         new googlemaps.LatLng(24.085, 120.552)
    //     );

    ygInit.promise.then(function () {

        // $scope.$watch(function () {
        //     return ygPost.filteredPosts;
        // }, function () {
        //     $scope.posts = ygPost.filteredPosts;
        // })

        // $scope.$watch(function () {
        //     return ygPost.filteredPosts.length;
        // }, function (newValue, oldValue) {
        //     $scope.posts = ygPost.filteredPosts;
        //     if(newValue > oldValue){
        //         for (var i = oldValue; i < newValue; i++) {
        //             $scope.addMarkerAnimation($scope.posts[i], 2000);
        //         }
        //     }
        //     else{
        //         for (var i = 0; i < newValue; i++) {
        //             $scope.addMarkerAnimation($scope.posts[i], 2000);
        //         }                
        //     }
        // });

        $scope.$watch(function () {
            return ygUserCtrl.focusedPostId;
        }, function(newValue, oldValue){
            if(!ygUserCtrl.isMouseOverMap){
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
    });

    $scope.mapIsReady = true;

});

}]);
