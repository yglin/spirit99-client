'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygToastTip
 * @description
 * # ygToastTip
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygToastTip',['$mdToast',
function ($mdToast) {
    var self = this;
    self.showToastTip = function (content) {
        $mdToast.show({
            template: '<md-toast>' + content + '</md-toast>'
        });
    };
}]);
