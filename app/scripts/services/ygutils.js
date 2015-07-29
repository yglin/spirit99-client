'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUtils
 * @description
 * # ygUtils
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUtils', function () {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    self.formatDatetime = function(dateString){
        var date = new Date(dateString);
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
            + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
});
