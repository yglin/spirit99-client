'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$rootScope', '$http', '$resource', 'portalRules', 'ygError', 'ygUserPref',
function ($rootScope, $http, $resource, portalRules, ygError, ygUserPref) {
    // AngularJS will instantiate a singleton by calling "new" on self function
    var self = this;

    self.servers = {};
    self.currentServerName = '';
    self.postResource = null;

    self.validatePortal = function(portalData){
        for (var i = 0; i < portalRules.requiredFields.length; i++) {
            if(!(portalRules.requiredFields[i] in portalData)){
                return false;
            }
        }
        return true;
    };

    self.switchServer = function(serverName){
        if(serverName in self.servers){
            self.servers[serverName].show = true;
            self.currentServerName = serverName;
            self.currentServer = self.servers[serverName];
        }
        else{
            console.log('沒有找到' + serverName + '啊！你是不是忘記load啦？');
        }
    };

    self.loadServer = function(portalUrl){
        $http.get(portalUrl)
        .success(function(response, status){
            // success
            if(self.validatePortal(response)){
                if(response.name in self.servers){
                    // Server already exists, update it
                    for(var key in response){
                        self.servers[response.name][key] = response[key];
                    }
                }
                else{
                    // Add brand new server
                    response.show = true;
                    self.servers[response.name] = response;
                }

                if(self.currentServerName === '' || response.name === ygUserPref.lastSelectedServer){
                    self.currentServerName = response.name;
                }
                // console.log(response);
                // // Switch to new server
                // self.switchServer(response.name);
            }
            else{
                var errorMessage = "載入失敗，請檢查傳送門網址是否正確：" + portalUrl;
                ygError.errorMessages.push(errorMessage);                
                console.log(errorMessage + " response:\n" + status + "\n" + response);
            }
        })
        .error(function(response, status){
            // error
            var errorMessage = "載入失敗，請檢查傳送門網址是否正確：" + portalUrl;
            self.errorMessages.push(errorMessage);
            console.log(errorMessage + " response:\n" + status + "\n" + response);
        });
    };

    self.removeServer = function(serverName){
        self.servers[serverName].show = false;
        if(self.currentServerName == serverName){
            self.currentServerName = '';
        }
    };

    self.updateServers = function(portals){
        for (var i = 0; i < portals.length; i++) {
            self.loadServer(portals[i]);
        }
    };

    // $watch-es
    $rootScope.$watch(function () {
        return self.currentServerName;
    }, function (newValue, oldValue) {
        if(newValue in self.servers){
            var server = self.servers[newValue];
            // New $resource object of self.posts
            self.postResource = $resource(server.postUrl, {}, {});
        }
    });

    // // Initialization
    // self.updateServers();
}]);
