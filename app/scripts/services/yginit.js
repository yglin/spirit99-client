'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygInit
 * @description
 * # ygInit
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygInit', ['$q', '$timeout', 'ygUserPref', 'ygUserCtrl', 'ygServer', 'ygPost', 'ygAudio', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
function ($q, $timeout, ygUserPref, ygUserCtrl, ygServer, ygPost, ygAudio, uiGmapGoogleMapApi, uiGmapIsReady) {
    var self = this;

    console.log('Start initialization');

    var promiseGetGeolocation = function (map, zoom) {
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
                deferred.reject);
        }
        else{
            deferred.reject("Not support Navigator.geolocation");
        }
        return deferred.promise;
    };
    
    uiGmapGoogleMapApi.then(function(maps) {
        self.GoogleMapsAPI = maps;
    });

    uiGmapIsReady.promise(1).then(function (instances) {
            console.log('uiGmap is ready');
    });

    // Level 1 processes: Initialize servers and google-map
    var level1Processes = [
        ygServer.updateServers(),
        uiGmapGoogleMapApi,
        uiGmapIsReady.promise(1),
    ];
    if(ygUserPref.$storage.autoGeolocation){
        level1Processes.push(promiseGetGeolocation(ygUserPref.$storage.map, 16));
    }

    // Level 2 processes: load posts
    var level2Processes = $q.allSettled(level1Processes).then(function () {
        var portalData = ygServer.servers[ygUserPref.$storage.selectedServer];
        if('soundSet' in portalData){
            ygAudio.loadSoundSet(portalData.soundSet);
        }
        var deferred = $q.defer();
        $timeout(function () {
            ygPost.reloadPosts().then(function () {
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
        }, 3000);
        return deferred.promise;
    });

    // Level 3 processes: start $rootscope watches in services
    var level3Processes = level2Processes.then(function () {
        ygPost.startWatches();
        ygUserCtrl.initialize();
        return $q.resolve();
    });

    self.promise = level3Processes;
}]);
