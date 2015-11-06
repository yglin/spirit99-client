'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserPref
 * @description
 * # ygUserPref
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserPref', ['$q', '$localStorage', '$log',
function ($q, $localStorage, $log) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    // $localStorage.$reset();
    self.$storage = $localStorage.$default({
        servers: {
            'nuclear-waste': {
                name: 'nuclear-waste',
                title: '核廢料掩埋場',
                portalUrl: 'http://spirit99-server-dev.elasticbeanstalk.com/nuclear-waste/portal',
                show: true
            },
            'localooxx': {
                name: 'localooxx',
                title: '地方的ＯＯ需要ＸＸ',
                portalUrl: 'http://spirit99-server-dev.elasticbeanstalk.com/localooxx/portal',
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
        mapHome: {
            center:{
                latitude: 23.973875,
                longitude: 120.982024
            },
            zoom: 16
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
        startUpAtMap: 'geolocation',
        autoOpenPostList: true,
        soundFX: true,
        showToastTips: true,
        // startAtGeolocation: true,
        myPosts: {},
        commentedPosts: {},
        followedPosts: {},
    });

    self.setMapHome = function () {
        self.$storage.mapHome = angular.copy(self.$storage.map);
    };

    self.promiseStartUpAtMap = function () {
        if(self.$storage.startUpAtMap === 'geolocation'){
            return self.promiseGetGeolocation(self.$storage.map);
        }
        else if(self.$storage.startUpAtMap === 'useMapHome'){
            for(var key in self.$storage.mapHome){
                if(key in self.$storage.map){
                    self.$storage.map[key] = self.$storage.mapHome[key];
                }
            }
            return $q.resolve();
        }
        else{
            return $q.resolve();
        }
    };

    self.promiseGetGeolocation = function (map, zoom) {
        $log.info('Start get geolocation');
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
                    $log.info('Finish get geolocation');
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
        'startUpAtMap': self.promiseStartUpAtMap()
        // 'getGeolocation': self.promiseGetGeolocation(self.$storage.map)
    };

}]);
