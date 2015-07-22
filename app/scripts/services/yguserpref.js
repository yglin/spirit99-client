'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserPref
 * @description
 * # ygUserPref
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserPref', function () {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    self.portals = [];

    self.lastSelectedServer = '';

    // load user prefs from local storage
    self.loadPref = function(){
        self.portals = [
            'http://localhost:3000/portal/localstory'
        ];
        self.lastSelectedServer = 'localstory';
    };

});
