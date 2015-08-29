'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ServerpaneCtrl
 * @description
 * # ServerpaneCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ServerPaneController', ['$scope', '$mdDialog', 'ygInit', 'ygUserPref', 'ygServer',
function($scope, $mdDialog, ygInit, ygUserPref, ygServer){
    // ============== Initilize scope model ==================
    // $scope.ygServer = ygServer;
    ygInit.promise.then(function () {
        $scope.servers = ygServer.servers;
    });

    // ============== Scope interaction functions =================
    $scope.addServer = function(portalUrl){
        ygServer.loadServer(portalUrl);
    };

    $scope.removeServer = function(serverName){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('移除站點')
            .content('確定要移除站點：' + ygServer.servers[serverName].title + '?')
            .ariaLabel('Remove Server')
            .ok('確定')
            .cancel('我按錯了');

        $mdDialog.show(confirm).then(
            function() {
                console.log('去死吧! ' + ygServer.servers[serverName].title + '去死!');
                ygServer.removeServer(serverName);
            },
            function() {
                console.log('阿不就按錯了!? O_o');
            });
    };

    $scope.switchServer = function(serverName){
        ygUserPref.$storage.selectedServer = serverName;
    };

}]);