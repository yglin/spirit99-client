'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ServerpaneCtrl
 * @description
 * # ServerpaneCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ServerListController', ['$scope', '$log', '$mdDialog', 'ygUserPref', 'ygServer',
function($scope, $log, $mdDialog, ygUserPref, ygServer){
    // ============== Initilize scope model ==================
    // $scope.ygServer = ygServer;
    ygServer.initialPromises.updateServers.then(function () {
        $scope.servers = ygServer.servers;
    });

    // ============== Scope interaction functions =================
    $scope.addServer = function(portalUrl){
        ygServer.loadServer(portalUrl);
    };

    $scope.removeServer = function(serverName){
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('移除電台')
            .content('確定要移除電台：' + ygServer.servers[serverName].title + '?')
            .ariaLabel('Remove Server')
            .ok('確定')
            .cancel('對不起我按錯了');

        $mdDialog.show(confirm).then(
            function() {
                $log.info('去死吧! ' + ygServer.servers[serverName].title + '去死!');
                ygServer.removeServer(serverName);
            },
            function() {
                $log.info('阿不就按錯了!? O_o');
            });
    };

    $scope.showServerIntro = ygServer.showServerIntro;

}]);