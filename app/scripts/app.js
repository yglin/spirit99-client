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
    'truncate'
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
.run(['ygUserPref', 'ygServer', function (ygUserPref, ygServer) {
    ygUserPref.loadPref();
    ygServer.updateServers();
}])
;
