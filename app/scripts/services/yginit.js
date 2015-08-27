'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygInit
 * @description
 * # ygInit
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygInit', ['$q', 'ygUserPref', 'ygServer', 'ygPost', 'uiGmapIsReady',
function ($q, ygUserPref, ygServer, ygPost, uiGmapIsReady) {
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

    var promiseUiGmapIsReady = function () {
        return uiGmapIsReady.promise(1).then(function (instances) {
            console.log('uiGmap is ready');
        });
    };

    var level1Processes = [
        ygServer.updateServers(),
        promiseUiGmapIsReady()
    ];
    if(ygUserPref.$storage.autoGeolocation){
        level1Processes.push(promiseGetGeolocation(ygUserPref.$storage.map, 16));
    }

    var level2Processes = $q.allSettled(level1Processes).then(function () {
        return ygPost.reloadPosts();
    });

    self.promise = level2Processes;
}]);
