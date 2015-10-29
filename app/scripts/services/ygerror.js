'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygError
 * @description
 * # ygError
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygError', ['$rootScope', '$mdDialog', 'ygAudio',
function ($rootScope, $mdDialog, ygAudio) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    self.errorMessages = [];

    var showError = function(errorMessage){
        var confirm = $mdDialog.confirm()
        .title('那Ａ安內')
        .content(errorMessage)
        .ok('回報問題')
        .cancel('喔 好');
        ygAudio.play('onError');
        $mdDialog
        .show(confirm)
        .then(function () {
            $mdDialog.show({
                controller: 'ReportIssueController',
                templateUrl: 'views/report-issue.html',
                clickOutsideToClose: true
            });
        });
    };

    $rootScope.$watchCollection(function(){
        return self.errorMessages;
    }, 
    function (newValue, oldValue){
        while(self.errorMessages.length > 0){
            var errorMessage = self.errorMessages.pop();
            showError(errorMessage);
        }
    });
}]);
