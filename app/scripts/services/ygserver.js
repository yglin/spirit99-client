'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$rootScope', '$http', '$resource', '$q', 'portalRules', 'ygError', 'ygUtils', 'ygUserPref', 'ygProgress',
function ($rootScope, $http, $resource, $q, portalRules, ygError, ygUtils, ygUserPref, ygProgress) {
    // AngularJS will instantiate a singleton by calling "new" on self function
    var self = this;

    self.portalDataDefaults = {
        show: true,
        logo: 'https://www.evansville.edu/residencelife/images/greenLogo.png',
        soundSet: {
                focusOnPost: {
                    file: 'sounds/big_bubble_blown_into_glass_through_drinking_straw_version_1.mp3',
                    volume: 0.5
                },
                scrollListPosts: {
                    file: 'sounds/bubbles_blown_into_glass_through_drinking_straw_version_2.mp3',
                    volume: 0.5
                },
                closeListPosts: {
                    file: 'sounds/large_water_drip.mp3',
                    volume: 0.5
                }
            }
    };
    self.servers = ygUserPref.$storage.servers;

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
            self.servers[serverName].show = true;
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

    self.updateServer = function (serverName, portalData) {
        if(self.validatePortal(portalData) && serverName in self.servers){
            self.servers[serverName] = ygUtils.fillDefaults(portalData, self.portalDataDefaults);            
        }        
    };

    self.updateServers = function(){
        console.log('Start update servers');
        var updatePromises = {};
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
                else if(self.validatePortal(data)){
                    data.portalUrl = portalUrl;
                    self.updateServer(data.name, data);
                }
                else{
                    console.log('Invalid portal data from ' + portalUrl);
                    console.log(data);
                }
            })
            .error(function (data, status){
                console.log('Failed to update server: status = ' + status + ', data = ' + data);
            });
        }

        var promise = $q.allSettled(updatePromises).then(function (dataArray) {
            if(ygUserPref.$storage.selectedServer in self.servers){
                self.switchServer(ygUserPref.$storage.selectedServer);
            }
            console.log('Finish update servers');
        });

        ygProgress.show('更新各站點...', promise);
        return promise;
    };

    self.createCommentResource = function (post_id) {
        return $resource(self.currentServer.postUrl + '/:id/comments');
    };

}]);
