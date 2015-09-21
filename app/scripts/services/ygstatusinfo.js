'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygStatusInfo
 * @description
 * # ygStatusInfo
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygStatusInfo', [function () {
    var self = this;

    self.statusIdle = function () {
        self.message = '';
        self.isProgressing = false;
    };

    self.statusProcessing = function (message) {
        self.message = message;
        self.isProgressing = true;
    };
}]);
