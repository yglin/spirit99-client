'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserPref
 * @description
 * # ygUserPref
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserPref', ['$localStorage', function ($localStorage) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    $localStorage.$reset();
    self.$storage = $localStorage.$default({
        servers: {
            localstory: {
                name: ' localstory',
                title: '在地的故事',
                portalUrl: 'http://localhost:3000/portal/localstory',
                show: true
            },
        },
        map: {
            center:{
                latitude: 23.973875,
                longitude: 120.982024
            },
            zoom: 6,
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
        lastSelectedServer: 'localstory',
        autoGeolocation: true,
    });

    self.servers = self.$storage.servers;
    self.map = self.$storage.map;
    self.filterCircle = self.$storage.filterCircle;
    self.lastSelectedServer = self.$storage.lastSelectedServer;
    self.autoGeolocation = self.$storage.autoGeolocation;

    self.selectServer = function (serverName) {
        self.$storage.lastSelectedServer = serverName;
    };

    self.setAutoGeolocation = function (isAutoGeolocation) {
        self.$storage.autoGeolocation = isAutoGeolocation;
    };

    // // load user prefs from local storage
    // self.loadPref = function(){
    //     // self.servers['localstory'] = {
    //     //     name: ' localstory',
    //     //     title: '在地的故事',
    //     //     portalUrl: 'http://localhost:3000/portal/localstory',
    //     //     show: true
    //     // };
    //     // self.servers['birdhome'] = {
    //     //     name: 'birdhome',
    //     //     title: '小小鳥兒要回家',
    //     //     portalUrl: 'http://localhost:3000/portal/birdhome',
    //     //     show: true
    //     // };
    //     // 
    // };

}]);
