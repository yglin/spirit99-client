'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygUtils
 * @description
 * # ygUtils
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygUtils', ['uiGmapGoogleMapApi', function (uiGmapGoogleMapApi) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    self.clearNullAndEmptyStrings = function (object) {
        for(var key in object){
            if(object[key] === null || object[key] === ''){
                delete object[key];
            }
            else if(typeof object[key] === 'object'){
                self.clearNullAndEmptyStrings(object[key]);
            }
        }        
    };

    self.fillDefaults = function (data, defaults) {
        for(var key in defaults){
            if(!(key in data) || data[key] === null){
                data[key] = defaults[key];
            }
        }
        return data;
    };

    self.formatDatetime = function(dateString){
        var date = new Date(dateString);
        // return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
            // + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        return date.toLocaleString();
    };

    self.getHateoasLinks = function(responseHeaders){
        var links = {};
        if('link' in responseHeaders && responseHeaders.link.length > 0){
           // Split parts by comma
            var parts = responseHeaders.link.split(',');
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

    self.historyBoundsUnion = null;
    self.maxBounds = null;

    self.updateMaxBounds = function (bounds) {
        return;
    };

    self.withinMaxBounds = function (bounds) {
        return false;
    };

    uiGmapGoogleMapApi.then(function (GMapAPI) {
        self.withinBounds = function (inBounds, outBounds) {
            if(outBounds.contains(inBounds.getSouthWest()) && outBounds.contains(inBounds.getNorthEast())){
                return true;
            }
            else{
                return false;
            }
        };

        self.updateMaxBounds = function (bounds) {
            var GMapBounds = new GMapAPI.LatLngBounds(
                new GMapAPI.LatLng(bounds.southwest.latitude, bounds.southwest.longitude),
                new GMapAPI.LatLng(bounds.northeast.latitude, bounds.northeast.longitude));
            if(self.historyBoundsUnion === null){
                self.historyBoundsUnion = GMapBounds;
                self.maxBounds = angular.copy(GMapBounds);
            }
            else{
                if(self.withinBounds(self.historyBoundsUnion, GMapBounds)){
                    // console.log('Update maxBounds!!');
                    self.maxBounds = GMapBounds;
                }
                self.historyBoundsUnion = self.historyBoundsUnion.union(GMapBounds);
                // console.log('Update historyBoundsUnion: ' + self.historyBoundsUnion.toString());
                // console.log('maxBounds: ' + self.maxBounds.toString());
            }
        };

        self.withinMaxBounds = function (bounds) {
            if(self.maxBounds === null){
                return false;
            }
            var GMapBounds = new GMapAPI.LatLngBounds(
                new GMapAPI.LatLng(bounds.southwest.latitude, bounds.southwest.longitude),
                new GMapAPI.LatLng(bounds.northeast.latitude, bounds.northeast.longitude));
            return self.withinBounds(GMapBounds, self.maxBounds);
        };
    });

}]);
