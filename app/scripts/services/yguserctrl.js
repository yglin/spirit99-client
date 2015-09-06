'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserCtrl
 * @description
 * # ygUserCtrl
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserCtrl', ['$rootScope', 'ygUserPref', 'ygServer',
function ($rootScope, ygUserPref, ygServer) {
    var self = this;
    self.openListPosts = false;
    self.focusedPostId = -1;
    self.isMouseOverMap = true;
    self.userAddress = '';
    self.geocode = {
        results: [],
        currentIndex: 0
    }

    self.buildIconCtrls = function (iconSet) {
        var iconCtrls = null;
        if(typeof iconSet === 'object' && iconSet != null){
            iconCtrls = {}
            for(var name in iconSet){
                iconCtrls[name] = {
                    url: iconSet[name],
                    show: true
                }
            }
        }
        return iconCtrls;        
    }

    self.initialize = function () {
        self.iconCtrls = self.buildIconCtrls(ygServer.servers[ygUserPref.$storage.selectedServer].iconSet)
        $rootScope.$watch(function () {
            return ygUserPref.$storage.selectedServer;
        }, function (newValue) {
            self.iconCtrls = self.buildIconCtrls(ygServer.servers[newValue].iconSet)
        })    
    };

}]);
