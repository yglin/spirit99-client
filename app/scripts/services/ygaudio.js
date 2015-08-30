'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygAudio
 * @description
 * # ygAudio
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygAudio', ['ngAudio', function (ngAudio) {
    var self = this;
    self.soundSet = {
        mouseOverPostMarker: {
            file: 'sounds/big_bubble_blown_into_glass_through_drinking_straw_version_1.mp3',
            volume: 0.5
        },
        openListPosts: {
            file: 'sounds/bubbles_blown_into_glass_through_drinking_straw_version_2.mp3',
            volume: 0.5
        }
    };

    self.loadSoundSet = function(soundSet){
        soundSet = typeof soundSet === 'undefined' ? self.soundSet : soundSet;
        for(var key in soundSet){
            self[key] = ngAudio.load(soundSet[key].file);
            self[key].volume = soundSet[key].volume;
        }
    };
}]);
