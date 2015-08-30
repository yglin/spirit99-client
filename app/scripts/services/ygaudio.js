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

    self.loadSoundSet = function(soundSet){
        for(var key in soundSet){
            self[key] = ngAudio.load(soundSet[key].file);
            self[key].volume = soundSet[key].volume;
        }
    };
}]);
