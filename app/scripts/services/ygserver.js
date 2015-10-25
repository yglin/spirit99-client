'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$rootScope', '$log', '$http', '$resource', '$q', '$mdDialog', 'uiGmapGoogleMapApi', 'nodeValidator', 'portalRules', 'ygError', 'ygUtils', 'ygUserPref', 'ygStatusInfo',
function ($rootScope, $log, $http, $resource, $q, $mdDialog, uiGmapGoogleMapApi, nodeValidator, portalRules, ygError, ygUtils, ygUserPref, ygStatusInfo) {
    // AngularJS will instantiate a singleton by calling "new" on self function
    var self = this;

    self.portalDataDefaults = {
        show: true,
        logo: 'https://www.evansville.edu/residencelife/images/greenLogo.png',
    };
    self.servers = ygUserPref.$storage.servers;
    self.selectedServer = null;
    self.resources = {};

    self.isSelectedServer = function () {
        return !angular.isUndefined(self.selectedServer) && self.selectedServer !== null;
    };

    self.validatePortal = function(portalData){
        for (var i = 0; i < portalRules.requiredFields.length; i++) {
            if(!(portalRules.requiredFields[i] in portalData)){
                $log.error('Missing required field: ' + portalRules.requiredFields[i] + ',\n in data: ' + portalData);
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
            $log.warn('沒有找到' + serverName + '啊！你是不是忘記load啦？');
        }
    };

    self.showServerIntro = function (serverName) {
        if(serverName in self.servers){
            $mdDialog.show({
                templateUrl: 'views/server-intro.html',
                controller: 'ServerIntroController',
                clickOutsideToClose: true,
                locals: {
                    server: self.servers[serverName]
                },
                preserveScope: true
            });
        }
        else{
            ygError.errorMessages.push('找不到電台資料：' + serverName);
        }
    };

    self.loadServer = function(portalUrl){
        $http.get(portalUrl)
        .success(function(response, status){
            // success
            if(self.validatePortal(response)){
                if(response.name in self.servers){
                    // Server already exists, update it
                    self.updateServer(response);
                }
                else{
                    self.servers[response.name] = ygUtils.fillDefaults(response, self.portalDataDefaults);
                }
                self.servers[response.name].portalUrl = portalUrl;
                self.servers[response.name].isReady = true;
                self.showServerIntro(response.name);
            }
            else{
                var errorMessage = "載入失敗，請檢查傳送門網址是否正確：" + portalUrl;
                ygError.errorMessages.push(errorMessage);                
                $log.warn(errorMessage + " response:\n" + status + "\n" + response);
            }
        })
        .error(function(response, status){
            // error
            var errorMessage = "載入失敗，請檢查傳送門網址是否正確：" + portalUrl;
            ygError.errorMessages.push(errorMessage);
            $log.warn(errorMessage + " response:\n" + status + "\n" + response);
        });
    };

    self.removeServer = function(serverName){
        if(self.selectedServer !== null && self.selectedServer.name === serverName){
            self.selectedServer = null;
        }
        delete self.servers[serverName];
    };

    self.errorGetPortal = function (response, status, headersGetter, request){
        $log.error('Failed to update server, portal url = ' + request.url + ', status = ' + status + ', response data = ' + response);
    };

    self.updateServer = function (portalData) {
        var serverName = portalData.name;
        var server = self.servers[serverName];
        var portalUrl = server.portalUrl;
        if(portalData.urls && portalData.urls.portalUrl){
            portalUrl = portalData.urls.portalUrl;
        }
        if(portalUrl !== server.portalUrl && nodeValidator.isURL(portalUrl)){
            // Got new portalUrl, update with new portal
            $log.info('Got new portal url , update from it: ' + portalUrl);
            return $http.get(portalUrl)
            .success(function (newestData) {
                if(self.validatePortal(newestData)){
                    self.servers[serverName] = ygUtils.fillDefaults(newestData, self.portalDataDefaults);            
                    self.servers[serverName].portalUrl = portalUrl;
                    self.servers[serverName].isReady = true;
                }        
            })
            .error(self.errorGetPortal);
        }
        else if(self.validatePortal(portalData)){
            self.servers[serverName] = ygUtils.fillDefaults(portalData, self.portalDataDefaults);
            self.servers[serverName].portalUrl = portalUrl;
            self.servers[serverName].isReady = true;
            return $q.resolve();
        }
        else{
            $log.error('Invalid portal data:' + JSON.stringify(portalData));
            return $q.reject('Invalid portal data:' + JSON.stringify(portalData));
        }
    };

    self.updateServers = function(){
        $log.info('Start update servers');
        ygStatusInfo.statusProcessing('更新電台資料...');
        var updatePromises = {};

        for (var name in self.servers) {
            self.servers[name].isReady = false;
            $log.info('Update station ' + name + ' from ' + self.servers[name].portalUrl);
            updatePromises[name] = $http.get(self.servers[name].portalUrl)
            .success(self.updateServer)
            .error(self.errorGetPortal);
        }

        var promise = $q.allSettled(updatePromises).then(function (dataArray) {
            if(ygUserPref.$storage.selectedServer in self.servers){
                self.switchServer(ygUserPref.$storage.selectedServer);
            }
            $log.info('Finish update servers');
            ygStatusInfo.statusIdle();
        });

        return promise;
    };

    self.getSupportPost = function () {
        if(!self.isSelectedServer()){
            return false;
        }

        if('post' in self.resources){
            return self.resources.post;
        }
        else if('postUrl' in self.selectedServer.urls){
            // Get fields names of post
            self.resources.post = $resource(
                self.selectedServer.urls.postUrl.replace(/\/+$/, '') + '/:id', {},
                {
                    'getMarkers': {
                        method: 'GET',
                        isArray: true,
                        params: {
                            fields: ['id', 'title', 'latitude', 'longitude', 'icon', 'create_time', 'modify_time']
                        }
                    },
                    'getDetails': {
                        method: 'GET',
                        params: {
                            fields: ['author', 'context']
                        }
                    },
                    'create': {
                        method: 'POST',
                        transformRequest: function (data, headersGetter) {
                            var postFields = ['id', 'title', 'context', 'author', 'icon', 'latitude', 'longitude'];
                            var outData = {};
                            for (var i = 0; i < postFields.length; i++) {
                                if(postFields[i] in data){
                                    outData[postFields[i]] = data[postFields[i]];
                                }
                            }
                            if(typeof outData === 'object'){
                                outData = angular.toJson(outData);
                            }
                            return outData;
                        }
                    },
                    'update': {
                        method: 'PUT',
                        headers: {
                            password: function (request) {
                                var password = '';
                                if('password' in request.params){
                                    password = request.params.password;
                                    delete request.params.password;
                                }
                                return password;
                            }
                        },
                        transformRequest: function (data, headersGetter) {
                            var postFields = ['title', 'context', 'author', 'icon', 'latitude', 'longitude'];
                            var outData = {};
                            for (var i = 0; i < postFields.length; i++) {
                                if(postFields[i] in data){
                                    outData[postFields[i]] = data[postFields[i]];
                                }
                            }
                            if(typeof outData === 'object'){
                                outData = angular.toJson(outData);
                            }
                            return outData;
                        }                        
                    },
                    'delete': {
                        method: 'DELETE',
                        headers: {
                            password: function (request) {
                                var password = '';
                                if('password' in request.params){
                                    password = request.params.password;
                                    delete request.params.password;
                                }
                                return password;
                            }
                        },
                    }
                });
            return  self.resources.post;       
        }
        else{
            return false;
        }
    };

    self.getSupportComment = function () {
        if(!self.isSelectedServer()){
            return false;
        }

        if('comment' in self.resources){
            return self.resources.comment;            
        }
        else if('commentUrl' in self.selectedServer.urls){
            self.resources.comment = $resource(self.selectedServer.urls.commentUrl);
            return self.resources.comment;
        }
        else{
            return false;
        }
    };

    self.getSupportFollowPost = function () {
        if(!self.isSelectedServer()){
            return false;
        }

        if('followPostBy' in self.selectedServer && self.selectedServer.followPostBy !== null){
            return true;
        }
        else{
            return false;
        }
    };

    self.getSupportIconSet = function () {
        return false;
    };
    uiGmapGoogleMapApi.then(function (googlemapsApi) {
        self.getSupportIconSet = function () {
            if(!self.isSelectedServer()){
                return false;
            }
            if('iconSet' in self.resources){
                return self.resources.iconSet;
            }
            else if('iconSet' in self.selectedServer && self.selectedServer.iconSet !== null){
                // Build icon objects
                self.resources.iconSet = {
                    default: {
                        url: 'images/icon-chat-48.png',
                        scaledSize: new googlemapsApi.Size(36, 36)
                    }
                };
                for(var iconName in self.selectedServer.iconSet){
                    var iconData  = self.selectedServer.iconSet[iconName];
                    if(nodeValidator.isURL(iconData)){
                        self.resources.iconSet[iconName] = {
                            url: iconData,
                            scaledSize: new googlemapsApi.Size(36, 36)
                        };
                    }
                    else if(typeof iconData === 'object' && 'url' in iconData){
                        self.resources.iconSet[iconName] = iconData;
                    }
                }
                return self.resources.iconSet;
            }
            else{
                return false;
            }
        };
    });

    self.getSupportVote = function () {
        if('vote' in self.resources){
            return self.resources.vote;
        }
        else if('voteUrl' in self.selectedServer.urls){
            self.resources.vote = $resource(self.selectedServer.urls.voteUrl.replace(/\/+$/, '') + '/:id',
            {post_id: '@post_id', id: '@id'},
            {
                'plusOne': {
                    method: 'PUT'
                },
                'delete': {
                    method: 'DELETE',
                    headers: {
                        password: function (request) {
                            var password = '';
                            if('password' in request.params){
                                password = request.params.password;
                                delete request.params.password;
                            }
                            return password;
                        }
                    }
                }
            });
            return self.resources.vote;
        }
        else{
            return false;
        }
    };

    self.getSupportUpload = function () {
        if('upload' in self.resources){
            return self.resources.upload;
        }
        else if('uploadToS3ConfigUrl' in self.selectedServer.urls){
            self.resources.upload = {
                s3Config: {},
                promiseS3Config: $http.get(self.selectedServer.urls.uploadToS3ConfigUrl)
                .then(function (response) {
                    self.resources.upload.s3Config = response.data;
                    return $q.resolve();
                }, function (error) {
                    return $q.reject(error);
                })
            };
            return self.resources.upload;
        }
        else if('uploadUrl' in self.selectedServer.urls){
            self.resources.upload = {
                url: self.selectedServer.urls.uploadUrl
            };
            if('uploadParamName' in self.selectedServer){
                self.resources.upload.paramName = self.selectedServer.uploadParamName;
            }
            return self.resources.upload;
        }
        else{
            return false;
        }
    };

    self.initialPromises = {
        'updateServers': self.updateServers()
    };

}]);
