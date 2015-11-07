'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygToastTip
 * @description
 * # ygToastTip
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygToastTip',['$q', '$mdToast', 'ygUserPref',
function ($q, $mdToast, ygUserPref) {
    var self = this;
    self.isShowingToast = false;
    self.showToastTip = function (content) {
        if(ygUserPref.$storage.showToastTips && !self.isShowingToast){
            self.isShowingToast = true;
            return $mdToast.show({
                template: '<md-toast>' + content + '</md-toast>'
            })
            .finally(function () {
                self.isShowingToast = false;
            });
        }
        else{
            return $q.reject();
        }
    };
}]);
