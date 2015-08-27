'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUserCtrl
 * @description
 * # ygUserCtrl
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUserCtrl', function () {
    var self = this;
    self.openListPosts = false;
    self.focusedPostId = -1;
});
