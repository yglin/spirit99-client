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
    // AngularJS will instantiate a singleton by calling "new" on this function

    // console.log($scope.servers);
    // this.servers = {
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

    this.errorMessages = [];
    
    this.servers = {};
    //XXX: Should be read from local storage
    this.portals = [
        'http://localhost:3000/portal/localstory',
    ];

    this.validatePortal = function(portalData){
        return true;
    };

    this.loadServer = function(portalUrl){
        $http.get(portalUrl)
        .success(function(response, status){
            // success
            if(self.validatePortal(response)){
                if(response.name in self.servers){
                    for(var key in response){
                        self.servers[response.name][key] = response[key];
                    }
                }
                else{
                    response.show = true;
                    self.servers[response.name] = response;
                }
            }
        })
        .error(function(response, status){
            // error
            var errorMessage = "載入失敗，請檢查傳送門網址是否正確：" + portalUrl;
            self.errorMessages.push(errorMessage);
            console.log(errorMessage + " response:\n" + status + "\n" + response);
        });
    };

    this.removeServer = function(serverName){
        self.servers[serverName].show = false;
    };

    // Update servers by a list of portal URLs
    this.updateServers = function(){
        for (var i = 0; i < this.portals.length; i++) {
            this.loadServer(this.portals[i]);
        }
    };

}]);
