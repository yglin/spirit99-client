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
        filter: {

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
        selectedServer: 'localstory',
        autoGeolocation: true,
        openListPosts: false,
        focusedPostId: -1,
    });

}]);
