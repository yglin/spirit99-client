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
    'duScroll',
    'ngAudio',
    'angular.validators',
    'datePicker'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/:stationName?', {
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
.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
    // ================== Decorate $log service to make it store loggings ================
    $provide.decorator('$log', ['$delegate', function ($delegate) {
        var functions = ['log', 'debug', 'info', 'warn', 'error'];
        var contentType = 'application/json; charset=UTF-8';

        $delegate.logHistory = {
            ajax: [],
            maxLength: {
                ajax: 1000
            }
        };
        _.each(functions, function (funcName){
            $delegate.logHistory[funcName] = [];
            $delegate.logHistory.maxLength[funcName] = 1000;
        });
        $delegate.originalFunctions = {};
        _.each(functions, function (funcName){
            $delegate.originalFunctions[funcName] = $delegate[funcName];
            $delegate[funcName] = _.wrap($delegate.originalFunctions[funcName],
            function (origFunc){
                var data = Array.prototype.slice.call(arguments, 1);
                origFunc.apply($delegate, data);

                $delegate.logHistory[funcName].push({
                    timestamp: new Date(),
                    context: data
                });
                while($delegate.logHistory[funcName].length > $delegate.logHistory.maxLength[funcName]){
                    $delegate.logHistory[funcName].shift();
                }
            });
        });

        $delegate.getHistory = function (levelName) {
            return $delegate.logHistory[levelName];    
        };
        return $delegate;
    }]);

    // =================== Log ajax error into logHistory, too ====================
    $httpProvider.interceptors.push(function($q, $log){
        return {
            'responseError': function (rejection) {
                $log.logHistory.ajax.push({
                    timestamp: new Date(),
                    context: rejection
                });
                while($log.logHistory.ajax.length > $log.logHistory.maxLength.ajax){
                    $log.logHistory.ajax.shift();
                }
                // console.log($log.logHistory.ajax);
                return $q.reject(rejection);
            }
        };
    });
}])
.value('portalRules', {
    requiredFields: [
        'name', 'title'
    ]
});
