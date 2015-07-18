'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ServerpaneCtrl
 * @description
 * # ServerpaneCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ServerPaneController', ['$scope', '$mdDialog', 'ygServer', function($scope, $mdDialog, ygServer){
    // ============== Initilize scope model ==================
    $scope.ygServer = ygServer;
    $scope.servers = ygServer.servers;

    // //XXX: Should be read from local storage
    // $scope.portals = [
    //     'http://localhost:3000/portal',
    // ];
    // ============== Scope utility functions ===================
    var showError = function(errorMessage){
        var alert = $mdDialog.alert()
            .title('靠妖那Ａ安內')
            .content(errorMessage)
            .ok('喔。');
        $mdDialog
            .show( alert );
            // .finally(function() {
            //     alert = undefined;
            // });
    };

    // ============== Scope $watches =================
    $scope.$watchCollection('ygServer.errorMessages', function(newValue, oldValue){
        // console.log('Got you!! ' + newValue);
        while($scope.ygServer.errorMessages.length > 0){
            var errorMessage = $scope.ygServer.errorMessages.pop();
            showError(errorMessage);
        }
    });

    // ============== Scope interaction functions =================
    $scope.addServer = function(portalUrl){
        // console.log("load server from " + portalUrl);
        $scope.ygServer.loadServer(portalUrl);
        //$scope.errorMessages.push('Testttttttesstttt');
    };

    $scope.removeServer = function(serverName){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('移除站點')
            .content('確定要移除站點：' + $scope.ygServer.servers[serverName].title + '?')
            .ariaLabel('Remove Server')
            .ok('確定')
            .cancel('我按錯了');

        $mdDialog.show(confirm).then(
            function() {
                console.log('去死吧! ' + $scope.ygServer.servers[serverName].title + '去死!');
                $scope.ygServer.removeServer(serverName);
            },
            function() {
                console.log('阿不就按錯了!? O_o');
            });
    };

    $scope.switchServer = function(serverName){
        $scope.ygServer.switchServer(serverName);
    };

    // $scope.addServer = function(portalUrl){
    //     $http.get(portalUrl)
    //     .success(function(data, status, headers, config) {
    //         //console.log(data);
    //         if(validateServer(data))
    //         {
    //             data.show = true;
    //             $scope.servers[data.name] = data;
    //         }
    //         //console.log($scope.servers);
    //     })
    //     .error(function(data, status, headers, config) {
    //         console.log('Failed to get portal data from ' + portalUrl + '\nReceived:\n' + status + '\n' + data);
    //     });        
    // };
    
    // $scope.updateServers = function(portals){
    //     for (var i = 0; i < portals.length; i++) {
    //         $scope.addServer(portals[i]);
    //     }
    // };

    

    // =================== Initializing actions ======================
    // $scope.updateServers($scope.portals);

}]);