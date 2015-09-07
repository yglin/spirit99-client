'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:MapcontrollerCtrl
 * @description
 * # MapcontrollerCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('MapController', ['$scope', '$timeout', 'uiGmapGoogleMapApi', 'ygUtils', 'ygError', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygPost', 'ygAudio',
function($scope, $timeout, uiGmapGoogleMapApi, ygUtils, ygError, ygUserPref, ygUserCtrl, ygServer, ygPost, ygAudio) {

    var self = this;

    self.googleMapApi = null;

    $scope.mapIsReady = false;

    $scope.map = ygUserPref.$storage.map;
    $scope.mapControl = {};
    $scope.mapEvents = {};
    $scope.posts = ygPost.filteredPosts;
    $scope.filterCircle = ygUserPref.$storage.filterCircle;

    $scope.newPost = null;
    $scope.timeoutLoadPosts = null;

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

    $scope.posts.addAsMarker = function (postData) {
        // console.log('Add post marker ' + postData.id);
        // $scope.addMarkerAnimation(postData, 2500);
        this.push(postData);
    };

    self.focusOnLocation = function (location, viewport) {
        $scope.map.center = {
            latitude: location.lat(),
            longitude: location.lng()
        };
        $scope.map.bounds = {
            southwest: {
                latitude: viewport.getSouthWest().lat(),
                longitude: viewport.getSouthWest().lng()
            },
            northeast: {
                latitude: viewport.getNorthEast().lat(),
                longitude: viewport.getNorthEast().lng()                                
            }
        };

        var markers = $scope.clickedMarker.control.getGMarkers();
        if(markers.length > 0){
            markers[0].setPosition(location);
            markers[0].setVisible(true);
        }
        $timeout.cancel($scope.timeoutLoadPosts);
        $scope.timeoutLoadPosts = $timeout(ygPost.loadPosts, 1000);
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
            maxWidth: 250
        }
    };

    $scope.onClickPostMarker = function (marker, eventName, model) {
        ygPost.showPostDetail(model.id);
    };

    $scope.onMouseoverPostMarker = function (marker, eventName, model) {
        $timeout.cancel(self.timeoutShowInfoWindow);
        self.timeoutShowInfoWindow = $timeout(function () {
            ygAudio.focusOnPost.play();
            $scope.infoWindow.coords = {
                latitude: model.latitude,
                longitude: model.longitude
            };
            $scope.infoWindow.templateParameter = model;
            $scope.infoWindow.show = true;
            ygUserCtrl.focusedPostId = model.id;
        }, 500);

        $timeout.cancel($scope.timeoutCloseInfoWindow);
        if(!ygUserCtrl.openListPosts){
            $scope.timeoutOpenListPosts = $timeout(function () {
                ygUserCtrl.openListPosts = true;
            }, 2000);
        }
    };

    $scope.onMouseoutPostMarker = function (marker, eventName, model) {
        $timeout.cancel(self.timeoutShowInfoWindow);
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
        $timeout.cancel($scope.timeoutLoadPosts);
        $scope.timeoutLoadPosts = $timeout(ygPost.loadPosts, 1000);
    };

    $scope.onZoomChangedMap = function (googleMaps, eventName, args) {
        $timeout.cancel($scope.timeoutLoadPosts);
        $scope.timeoutLoadPosts = $timeout(ygPost.loadPosts, 1000);
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

    $scope.$watch(function () {
        return ygUserCtrl.focusedPostId;
    }, function(newValue, oldValue){
        if(!ygUserCtrl.isMouseOverMap){
            var post = ygPost.indexedPosts[newValue];
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

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(googlemaps) {

        $scope.infoWindow.options.pixelOffset = new googlemaps.Size(0, -40);

        $scope.addMarkerAnimation = function (post, interval) {
            post.options = typeof post.options === 'undefined' ? {} : post.options;
            post.options.animation = googlemaps.Animation.BOUNCE;
            $timeout(function () {
                post.options.animation = null;
            }, interval);
        };

        self.geocoder = new googlemaps.Geocoder();
        $scope.$watch(function () {
            return ygUserCtrl.userAddress;
        }, function (newValue) {
            if(newValue.length > 0){
                if(typeof self.watchNextGeocodeLocation === 'function'){
                    self.watchNextGeocodeLocation();
                }
                ygUserCtrl.geocode.results = [];
                ygUserCtrl.geocode.currentIndex = 0;                
                self.geocoder.geocode({address: newValue}, function (results, status) {
                    if(status == googlemaps.GeocoderStatus.OK){
                        self.focusOnLocation(results[0].geometry.location, results[0].geometry.viewport);
                        if(results.length > 1){
                            ygUserCtrl.geocode.results = results;
                            ygUserCtrl.geocode.currentIndex = 0;
                            self.watchNextGeocodeLocation = $scope.$watch(
                                function () {
                                    return ygUserCtrl.geocode.currentIndex;
                                },
                                function (newValue) {
                                    var geoLoc = ygUserCtrl.geocode.results[newValue];
                                    self.focusOnLocation(geoLoc.geometry.location, geoLoc.geometry.viewport);
                                }
                            );
                        }
                    }
                    else{
                        console.log("Geocode was not successful for the following reason: " + status);
                        if(status == googlemaps.GeocoderStatus.ZERO_RESULTS){
                            ygError.errorMessages.push('找不到符合搜尋條件的地點');
                        }
                        else{
                            ygError.errorMessages.push('搜尋失敗，請稍候再試');
                        }
                    }
                });
            }
        });

        $scope.mapIsReady = true;
    });

}]);
