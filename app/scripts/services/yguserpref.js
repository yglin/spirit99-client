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

    self.servers = {};
    self.lastSelectedServer = '';

    // load user prefs from local storage
    self.loadPref = function(){
        self.servers['localstory'] = {
            name: ' localstory',
            title: '在地的故事',
            portalUrl: 'http://localhost:3000/portal/localstory'
        };
        self.lastSelectedServer = 'localstory';
    };

});
