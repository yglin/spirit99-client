'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygServer
 * @description
 * # ygServer
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygServer', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on self function

    // console.log($scope.servers);
    // self.servers = {
    //     localstory: {
    //         name: 'local-stories',
    //         title: '在地的故事',
    //         logo: 'http://img4.wikia.nocookie.net/__cb20140710145414/finalfantasy/images/e/e6/Town-ffta-icon.png',
    //         show: true
    //     },
    //     'bird-back-home': {
    //         name: 'bird-back-home',
    //         title: '小小鳥兒要回家',
    //         logo: 'http://www.abeka.com/BookImages/ClipArt/226807/46x46y50fx50fh/226807-Red-Parrot-with-yellow-and-blue-wings-color-pdf.png',
    //         show: true
    //     }
    // };
    // 
    var self = this;

    //XXX: Should be read from local storage
    self.portals = [
        'http://localhost:3000/portal/localstory',
    ];

    self.errorMessages = [];
    
    self.servers = {};
    self.currentServerName = 'No server yet';

    self.validatePortal = function(portalData){
        // TODO: Validation rules
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
                // console.log(response);
                // // Switch to new server
                // self.switchServer(response.name);
            }
            else{
                var errorMessage = "載入失敗，請檢查傳送門網址是否正確：" + portalUrl;
                self.errorMessages.push(errorMessage);                
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
    };

    // Update servers by a list of portal URLs
    self.updateServers = function(){
        for (var i = 0; i < self.portals.length; i++) {
            self.loadServer(self.portals[i]);
        }
    };

    // Initialization
    self.updateServers();
}]);
