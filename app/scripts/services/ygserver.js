'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$http', '$resource', '$q', 'portalRules', 'ygError', 'ygUserPref',
function ($http, $resource, $q, portalRules, ygError, ygUserPref) {
    // AngularJS will instantiate a singleton by calling "new" on self function
    var self = this;

    self.servers = ygUserPref.servers;
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

    self.fillDefaultOptions = function (portalData) {
        portalData.show = true;
    }

    self.switchServer = function(serverName){
        if(serverName in self.servers){
            self.servers[serverName].show = true;
            self.currentServerName = serverName;
            self.currentServer = self.servers[serverName];

            // Create new post resource for current server
            self.postResource = $resource(self.currentServer.postUrl, {}, {});
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
                    self.fillDefaultOptions(response);
                    self.servers[response.name] = response;
                }
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
        if(self.currentServerName === serverName){
            self.currentServerName = '';
        }
    };

    self.updateServers = function(){
        var updatePromises = {};
        // console.log(self.servers);
        for (var name in self.servers) {
            updatePromises[name] = $http.get(self.servers[name].portalUrl);
        }

        $q.all(updatePromises).then(function (dataArray) {
            for (var name in dataArray) {
                var portalUrl = dataArray[name].config.url
                var portalData = dataArray[name].data;
                if(self.validatePortal(portalData)){
                    if(name in self.servers){
                        // Server already exists, update it
                        for(var key in portalData){
                            self.servers[name][key] = portalData[key];
                        }
                        // update portal Url
                        self.servers[name].portalUrl = portalUrl;
                    }
                }
            }
            console.log(self.servers);
            if(ygUserPref.lastSelectedServer in self.servers){
                self.switchServer(ygUserPref.lastSelectedServer);
            }
        });

    };

}]);
