'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserCtrl
 * @description
 * # ygUserCtrl
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserCtrl', ['$rootScope', '$q', 'nodeValidator', 'ygServer',
function ($rootScope, $q, nodeValidator, ygServer) {
    var self = this;
    self.openPostList = false;
    self.focusedPostId = -1;
    self.isMouseOverMap = true;
    self.userAddress = '';
    self.geocode = {
        results: [],
        currentIndex: 0
    };

    self.iconCtrls = {};
    self.iconCount = 0;
    self.refreshIconCtrls = function (server) {
        var name;
        if(server !== null && 'iconSet' in server &&
        typeof server.iconSet === 'object' && server.iconSet !== null){
            for(name in self.iconCtrls){
                if(!(name in server.iconSet)){
                    delete self.iconCtrls[name];
                }
            }
            for(name in server.iconSet){
                if(nodeValidator.isURL(server.iconSet[name])){
                    self.iconCtrls[name] = {
                        url: server.iconSet[name],
                        show: true
                    };
                }
                else if('url' in server.iconSet[name]){
                    self.iconCtrls[name] = {
                        url: server.iconSet[name].url,
                        show: true
                    };
                }
            }
            self.iconCount = Object.keys(self.iconCtrls).length;
        }
        else{
            for(name in self.iconCtrls){
                delete self.iconCtrls[name];
            }
            self.iconCount = 0;
        }
    };

    self.initialPromises = {};
    self.initialPromises.refreshIconCtrls = ygServer.initialPromises.updateServers
    .then(function () {
        self.refreshIconCtrls(ygServer.selectedServer);
        $rootScope.$watch(function () {
            return ygServer.selectedServer;
        }, function () {
            self.refreshIconCtrls(ygServer.selectedServer);
        });
        return $q.resolve();
    });

}]);
