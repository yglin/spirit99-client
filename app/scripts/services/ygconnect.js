'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygConnect
 * @description
 * # ygConnect
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygConnect', ['$rootScope', 'ygUserPref', 'ygServer',
function ($rootScope, ygUserPref, ygServer) {
    var self = this;

    self.canConnectPosts = false;

    ygServer.initialPromises['updateServers'].then(function () {
        self.canConnectPosts = 'postRelationUrl' in ygServer.servers[ygUserPref.$storage.selectedServer];
        $rootScope.$watch(
            function () {
                return ygUserPref.$storage.selectedServer;
            }, function () {
                self.canConnectPosts = 'postRelationUrl' in ygServer.servers[ygUserPref.$storage.selectedServer];
            }
        );
    });
}]);
