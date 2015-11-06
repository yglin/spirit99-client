'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygToastTip
 * @description
 * # ygToastTip
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygToastTip',['$mdToast', 'ygUserPref',
function ($mdToast, ygUserPref) {
    var self = this;
    self.showToastTip = function (content) {
        if(ygUserPref.$storage.showToastTips){
            $mdToast.show({
                template: '<md-toast>' + content + '</md-toast>'
            });            
        }
    };
}]);
