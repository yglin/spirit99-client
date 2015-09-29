'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$rootScope', '$http', '$resource', '$q', 'portalRules', 'ygError', 'ygUtils', 'ygUserPref', 'ygStatusInfo',
function ($rootScope, $http, $resource, $q, portalRules, ygError, ygUtils, ygUserPref, ygStatusInfo) {
    // AngularJS will instantiate a singleton by calling "new" on self function
    var self = this;

    self.portalDataDefaults = {
        show: true,
        logo: 'https://www.evansville.edu/residencelife/images/greenLogo.png',
    };
    self.servers = ygUserPref.$storage.servers;
    self.selectedServer = self.servers[ygUserPref.$storage.selectedServer];
    self.resources = {};

    self.validatePortal = function(portalData){
        for (var i = 0; i < portalRules.requiredFields.length; i++) {
            if(!(portalRules.requiredFields[i] in portalData)){
                console.log('Missing required field: ' + portalRules.requiredFields[i] + ',\n in data: ' + portalData);
                return false;
            }
        }
        return true;
    };

    // // XXX: Should implement deep object update
    // self.fillDefaultOptions = function (serverOptions) {
    //     for(var key in self.portalDataDefaults){
    //         serverOptions[key] = typeof serverOptions[key] === typeof self.portalDataDefaults[key] ? serverOptions[key] : self.portalDataDefaults[key];
    //     }
    // };

    self.switchServer = function(serverName){
        if(serverName in self.servers){
            ygUserPref.$storage.selectedServer = serverName;
            self.selectedServer = self.servers[serverName];
            self.selectedServer.show = true;
            self.resources = {};
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
                    // self.fillDefaultOptions(response);
                    self.servers[response.name] = ygUtils.fillDefaults(response, self.portalDataDefaults);
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

    self.updateServer = function (portalData) {
        var serverName = portalData.name;
        var server = self.servers[serverName];
        if(('portalUrl' in portalData) && portalData.portalUrl !== server.portalUrl){
        // Got new portalUrl, update with new portal
            return $http.get(portalData.portalUrl)
            .success(function (newestData) {
                if(self.validatePortal(newestData)){
                    self.servers[serverName] = ygUtils.fillDefaults(newestData, self.portalDataDefaults);            
                    self.servers[serverName].portalUrl = portalData.portalUrl;
                }        
            })
            .error(function (data, status) {
                console.log('Failed to update server: status = ' + status + ', data = ' + data);
            });
        }
        else if(self.validatePortal(portalData)){
            self.servers[serverName] = ygUtils.fillDefaults(portalData, self.portalDataDefaults);            
            // self.servers[serverName].portalUrl = portalData.portalUrl;
            return $q.resolve();
        }
        else{
            console.log('Invalid portal data:' + JSON.stringify(portalData));
            return $q.reject('Invalid portal data:' + JSON.stringify(portalData));
        }
    };

    self.updateServers = function(){
        console.log('Start update servers');
        ygStatusInfo.statusProcessing('更新電台資料...');
        var updatePromises = {};

        function errorGetPortal (data, status){
            console.log('Failed to update server: status = ' + status + ', data = ' + data);
        }

        for (var name in self.servers) {
            // console.log(self.servers[name].portalUrl);
            updatePromises[name] = $http.get(self.servers[name].portalUrl)
            .success(self.updateServer)
            .error(errorGetPortal);
        }

        var promise = $q.allSettled(updatePromises).then(function (dataArray) {
            if(ygUserPref.$storage.selectedServer in self.servers){
                self.switchServer(ygUserPref.$storage.selectedServer);
            }
            console.log('Finish update servers');
            ygStatusInfo.statusIdle();
        });

        // ygProgress.show('更新各站點...', promise);
        return promise;
    };

    self.getSupportComment = function () {
        if('comment' in self.resources){
            return self.resources.comment;            
        }
        else if('commentUrl' in self.selectedServer){
            self.resources.comment = $resource(self.selectedServer['commentUrl']);
            return self.resources.comment;
        }
        else{
            return false;
        }
    };

    self.initialPromises = {
        'updateServers': self.updateServers()
    };

}]);
