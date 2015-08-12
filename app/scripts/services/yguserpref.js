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
            portalUrl: 'http://localhost:3000/portal/localstory',
            show: true
        };
        self.servers['birdhome'] = {
            name: 'birdhome',
            title: '小小鳥兒要回家',
            portalUrl: 'http://localhost:3000/portal/birdhome',
            show: true
        };
        self.lastSelectedServer = 'localstory';
        self.filterCircle = {
            center: {
                latitude: 23.973875,
                longitude: 120.982024
            },
            radius: 10000,
            stroke: {
                color: '#08B21F',
                weight: 1,
                opacity: 0.25
            },
            fill: {
                color: '#08B21F',
                opacity: 0.25
            },
            editable: true,
            visible: true
        };
    };

});
