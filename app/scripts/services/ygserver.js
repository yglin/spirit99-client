'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$http', '$resource', '$q', 'portalRules', 'ygError', 'ygUserPref', 'ygProgress',
function ($http, $resource, $q, portalRules, ygError, ygUserPref, ygProgress) {
    // AngularJS will instantiate a singleton by calling "new" on self function
    var self = this;

    self.portalDataDefaults = {
        show: true,
        logo: 'https://www.evansville.edu/residencelife/images/greenLogo.png',
    };
    self.servers = ygUserPref.servers;
    self.currentServerName = '';
    self.postResource = null;

    self.validatePortal = function(portalData){
        for (var i = 0; i < portalRules.requiredFields.length; i++) {
            if(!(portalRules.requiredFields[i] in portalData)){
                console.log('Missing required field: ' + portalRules.requiredFields[i] + ',\n in data: ' + portalData);
                return false;
            }
        }
        return true;
    };

    self.fillDefaultOptions = function (serverOptions) {
        for(var key in self.portalDataDefaults){
            serverOptions[key] = typeof serverOptions[key] !== 'undefined' ? serverOptions[key] : self.portalDataDefaults[key];
        }
    };

    self.switchServer = function(serverName){
        if(serverName in self.servers){
            self.servers[serverName].show = true;
            self.currentServerName = serverName;
            self.currentServer = self.servers[serverName];

            // Create new post resource for current server
            self.postResource = $resource(self.currentServer.postUrl + '/:id');
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

    self.updateServer = function (serverName, portalData) {
        if(self.validatePortal(portalData) && serverName in self.servers){
            for(var key in portalData){
                self.servers[serverName][key] = portalData[key];
            }
            self.fillDefaultOptions(self.servers[serverName]);            
        }        
    };

    self.updateServers = function(){
        var updatePromises = {};
        // TODO: Fix this strategy, each server update should be solved independently,
        // TODO: and return the final promise to updatePromises[]
        for (var name in self.servers) {
            updatePromises[name] = $http.get(self.servers[name].portalUrl)
            .success(function (data, status, header, config) {
                var portalUrl = config.url;
                if(('portalUrl' in data) && data.portalUrl != portalUrl){
                // Got new portalUrl, update with new portal
                    return $http.get(data.portalUrl)
                    .success(function (newData) {
                        newData.portalUrl = data.portalUrl;
                        self.updateServer(newData.name, newData);
                    })
                    .error(function (data, status) {
                        console.log('Failed to update server: status = ' + status + ', data = ' + data);
                    });
                }
                else{
                    data.portalUrl = portalUrl;
                    self.updateServer(data.name, data);
                }
            })
            .error(function (data, status){
                console.log('Failed to update server: status = ' + status + ', data = ' + data);
            });
        }

        var promise = $q.allSettled(updatePromises).then(function (dataArray) {
            if(ygUserPref.lastSelectedServer in self.servers){
                self.switchServer(ygUserPref.lastSelectedServer);
            }
        });

        ygProgress.show('更新各站點...', promise);
    };

    self.postServer = function (data) {
        self.postResource.save(data).then(function(){
            self.postResource.query();
        });
    };

    self.createCommentResource = function (post_id) {
        return $resource(self.currentServer.postUrl + '/:id/comments');
    };

}]);
