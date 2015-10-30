'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygAudio
 * @description
 * # ygAudio
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygAudio', ['$rootScope', 'ngAudio', 'ygUserPref',
function ($rootScope, ngAudio, ygUserPref) {
    var self = this;

    self.defaultSoundSet = {
        focusOnPost: {
            file: 'sounds/water_drip_006.mp3',
            volume: 0.5
        },
        openPostList: {
            file: 'sounds/water_bubbles_002.mp3',
            volume: 0.5
        },
        closePostList: {
            file: 'sounds/large_water_drip.mp3',
            volume: 0.5
        },
        toggleIconCtrl: {
            file: 'sounds/water_drip_009.mp3',
            volume: 0.5
        },
        openPostEditor: {
            file: 'sounds/big_bubble_blown_into_glass_through_drinking_straw_version_2.mp3',
            volume: 0.5
        },
        openPostView: {
            file: 'sounds/big_bubble_blown_into_glass_through_drinking_straw_version_1.mp3',
            volume: 0.5
        },
        onError: {
            file: 'sounds/water_splash_in_flooded_bunker_006.mp3',
            volume: 0.5
        },
        openStationIntro: {
            file: 'sounds/bubbles_blown_into_glass_through_drinking_straw_version_2.mp3',
            volume: 0.5
        }
    };

    self.play = function (soundName) {
        if(ygUserPref.$storage.soundFX && soundName in self){
            self[soundName].progress = 0;
            self[soundName].play();
        }
    };

    self.loadSoundSet = function (soundSet) {
        for(var key in soundSet){
            self[key] = ngAudio.load(soundSet[key].file);
            self[key].volume = soundSet[key].volume;
        }
    };

    self.reloadSoundSet = function (soundSet) {
        self.loadSoundSet(self.defaultSoundSet);
        if(angular.isDefined(soundSet) && soundSet !== null){
            self.loadSoundSet(soundSet);
        }
    };

    // self.loadSoundSetFromSelectedServer = function(){
    //     if(ygServer.selectedServer !== null && 'soundSet' in ygServer.selectedServer){
    //         self.loadSoundSet(ygServer.selectedServer.soundSet);
    //     }
    // };

    // ngAudio.mute();

    // ygServer.initialPromises.updateServers.then(function () {
    //     self.loadSoundSetFromSelectedServer();
    //     $rootScope.$watch(function () {
    //         return ygServer.selectedServer;
    //     }, function () {
    //         self.loadSoundSetFromSelectedServer();
    //         // ngAudio.mute();
    //     });
    // });

}]);
