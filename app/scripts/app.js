'use strict';

/**
 * @ngdoc overview
 * @name spirit99App
 * @description
 * # spirit99App
 *
 * Main module of the application.
 */
angular
.module('spirit99App', [
    'ngMessages',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngPromiseExtras',
    'uiGmapgoogle-maps',
    'froala',
    'truncate',
    'ngFitText',
    'ngStorage',
    'duScroll'
])
.value('portalRules', {
    requiredFields: [
        'name', 'title', 'postUrl'
    ]
})
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
})
// Angular Material theme config
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('orange');
})
// Angular Google Map
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyB5rcT4tYhcrHp5NwEophBjfKV0uilCNEE',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
// Kick-start the app
.run(['$q', 'ygUserPref', 'ygServer', 'ygPost', 'uiGmapIsReady',
function ($q, ygUserPref, ygServer, ygPost, uiGmapIsReady) {
    // ygUserPref.loadPref();
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

    var initialPromises = [ygServer.updateServers(), promiseUiGmapIsReady()];
    if(ygUserPref.$storage.autoGeolocation){
        initialPromises.push(promiseGetGeolocation(ygUserPref.$storage.map, 16));
    }

    $q.allSettled(initialPromises).then(function () {
        ygPost.reloadPosts();
        ygPost.startWatches();
        console.log('Finish initialization');
    });
}])
;
