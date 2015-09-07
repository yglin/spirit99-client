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
    };

    self.iconCtrls = {};
    self.refreshIconCtrls = function (iconSet) {
        if(typeof iconSet === 'object' && iconSet != null){
            for(var name in self.iconCtrls){
                if(!(name in iconSet)){
                    delete self.iconCtrls[name];
                }
            }
            for(var name in iconSet){
                self.iconCtrls[name] = {
                    show: true
                };
            }
        }
    }

    self.initialPromises = {};
    self.initialPromises['refreshIconCtrls'] = ygServer.initialPromises['updateServers']
    .then(function () {
        self.refreshIconCtrls(ygServer.servers[ygUserPref.$storage.selectedServer].iconSet)
        $rootScope.$watch(function () {
            return ygUserPref.$storage.selectedServer;
        }, function (newValue) {
            self.refreshIconCtrls(ygServer.servers[newValue].iconSet);
        });
        return $q.resolve();
    });

}]);
