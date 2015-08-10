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
    };

    self.getHateoasLinks = function(responseHeaders){
        var links = {};
        if('link' in responseHeaders && responseHeaders['link'].length > 0){
           // Split parts by comma
            var parts = responseHeaders['link'].split(',');
            // Parse each part into a named link
            for(var i=0; i<parts.length; i++) {
                var section = parts[i].split(';');
                if (section.length !== 2) {
                    throw new Error("section could not be split on ';'");
                }
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = url;
            }
        }
        return links;
    };
});
