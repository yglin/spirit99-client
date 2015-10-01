'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygAudio
 * @description
 * # ygAudio
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygAudio', ['$rootScope', 'ngAudio', 'ygUserPref', 'ygServer',
function ($rootScope, ngAudio, ygUserPref, ygServer) {
    var self = this;

    self.defaultSoundSet = {
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
        },
        toggleIconCtrl: {
            file: 'sounds/water_drip_009.mp3',
            volume: 0.5
        }
    };

    self.loadSoundSet = function (soundSet) {
        for(var key in soundSet){
            self[key] = ngAudio.load(soundSet[key].file);
            self[key].volume = soundSet[key].volume;
        }
    };

    self.loadSoundSet(self.defaultSoundSet);

    self.loadSoundSetFromSelectedServer = function(){
        if(ygServer.selectedServer !== null && 'soundSet' in ygServer.selectedServer){
            self.loadSoundSet(ygServer.selectedServer.soundSet);
        }
    };

    ygServer.initialPromises.updateServers.then(function () {
        self.loadSoundSetFromSelectedServer();
        $rootScope.$watch(function () {
            return ygServer.selectedServer;
        }, function  () {
            self.loadSoundSetFromSelectedServer();
        });
    });

}]);
