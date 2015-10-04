'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserPref
 * @description
 * # ygUserPref
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserPref', ['$q', '$localStorage',
function ($q, $localStorage) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    // $localStorage.$reset();
    self.$storage = $localStorage.$default({
        servers: {
            'nuclear-waste': {
                name: 'nuclear-waste',
                title: '核廢料掩埋場',
                portalUrl: 'http://nuclear-waste-dev.elasticbeanstalk.com/portal',
                show: true
            }
        },
        map: {
            center:{
                latitude: 23.973875,
                longitude: 120.982024
            },
            bounds: {
                northeast: {
                    latitude: 18.862283857359866,
                    longitude: 106.13949470312502
                },
                southwest: {
                    latitude: 28.89053701901714,
                    longitude: 135.82455329687502                    
                }
            },
            zoom: 6,
        },
        filters: {
            title: {
                keywords: []
            },
            create_time: {
                startDate: new Date(0),
                endDate: new Date(2200, 11, 31)
            }
        },
        filterCircle: {
            center: {
                latitude: 24.081665,
                longitude: 120.538539
            },
            radius: 1000,
            stroke: {
                color: '#08B21F',
                weight: 1,
                opacity: 0.25
            },
            fill: {
                color: '#08B21F',
                opacity: 0.25
            },
            clickable: false,
            editable: true,
            visible: false
        },
        selectedServer: 'nuclear-waste',
        startAtGeolocation: true,
        followedPosts: {},
        myPosts: {}
    });

    self.promiseGetGeolocation = function (map, zoom) {
        if(!self.$storage.startAtGeolocation){
            // No need to get geolocation, return imediatedlly resolved promise
            return $q.resolve();
        }
        console.log('Start get geolocation');
        zoom = typeof zoom !== 'undefined' ? zoom : 15;
        var deferred = $q.defer();
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function(position){
                    map.center = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    map.zoom = zoom;
                    console.log('Finish get geolocation');
                    deferred.resolve();
                },
                function (error) {
                   deferred.reject(error.message);  
                 });
        }
        else{
            deferred.reject("Not support Navigator.geolocation");
        }
        return deferred.promise;
    };

    self.initialPromises = {
        'getGeolocation': self.promiseGetGeolocation(self.$storage.map)
    };

}]);
