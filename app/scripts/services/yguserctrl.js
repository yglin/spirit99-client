'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserCtrl
 * @description
 * # ygUserCtrl
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserCtrl', ['$rootScope', '$q', 'ygUserPref', 'ygServer',
function ($rootScope, $q, ygUserPref, ygServer) {
    var self = this;
    self.openListPosts = false;
    self.focusedPostId = -1;
    self.isMouseOverMap = true;
    self.userAddress = '';
    self.geocode = {
        results: [],
        currentIndex: 0
    }

    self.buildIconModels = function (iconSet) {
        var iconModels = null;
        if(typeof iconSet === 'object' && iconSet != null){
            iconModels = {}
            for(var name in iconSet){
                iconModels[name] = {
                    url: iconSet[name],
                    show: true
                }
            }
        }
        return iconModels;        
    }

    self.initialPromises = {};
    self.initialPromises['buildIconModels'] = ygServer.initialPromises['updateServers']
    .then(function () {
        self.iconModels = self.buildIconModels(ygServer.servers[ygUserPref.$storage.selectedServer].iconSet)
        $rootScope.$watch(function () {
            return ygUserPref.$storage.selectedServer;
        }, function (newValue) {
            self.iconModels = self.buildIconModels(ygServer.servers[newValue].iconSet)
        });
        return $q.resolve();
    });

}]);
