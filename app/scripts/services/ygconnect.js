'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygConnect
 * @description
 * # ygConnect
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygConnect', ['$rootScope', '$resource', 'ygUserPref', 'ygServer',
function ($rootScope, $resource, ygUserPref, ygServer) {
    var self = this;

    self.connections = {};
    self.canConnectPosts = false;
    self.relationResource = null;

    ygServer.initialPromises['updateServers'].then(function () {
        self.canConnectPosts = 'postRelationUrl' in ygServer.servers[ygUserPref.$storage.selectedServer];
        if(self.canConnectPosts){
            self.relationResource = $resource(ygServer.servers[ygUserPref.$storage.selectedServer].postRelationUrl);
        }
        $rootScope.$watch(
            function () {
                return ygUserPref.$storage.selectedServer;
            }, function () {
                self.canConnectPosts = 'postRelationUrl' in ygServer.servers[ygUserPref.$storage.selectedServer];
                if(self.canConnectPosts){
                    self.relationResource = $resource(ygServer.servers[ygUserPref.$storage.selectedServer].postRelationUrl);
                }
            }
        );
    });

    self.newRelation = null;
    self.selectConnectingPost = function (post_id) {
        if(self.newRelation === null){
            self.newRelation = new self.relationResource();
            self.newRelation.postIDs = [];
        }
        if(self.newRelation.postIDs.indexOf(post_id) == -1){
            self.newRelation.postIDs.push(post_id);
        }
        // console.log(self.newRelation);
 
        if(self.newRelation.postIDs.length >= 2){
            self.newRelation.$save().then(
            function (response) {
                // console.log(response);
                var index = response.post_id1 + '_' + response.post_id2;
                self.connections[index] = response;
                console.log(self.connections);
                self.newRelation = null;                
            }, function (error) {
                console.log(error);
                self.newRelation = null;                
            });
        }
    };

}]);
