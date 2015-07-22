'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygError
 * @description
 * # ygError
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygError', ['$rootScope', '$mdDialog', function ($rootScope, $mdDialog) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;

    self.errorMessages = [];

    var showError = function(errorMessage){
        var alert = $mdDialog.alert()
            .title('靠妖那Ａ安內')
            .content(errorMessage)
            .ok('喔。');
        $mdDialog
            .show( alert );
    };

    $rootScope.$watchCollection(function(){
        return self.errorMessages;
    }, 
    function (newValue, oldValue){
        // console.log('Got you!! ' + newValue);
        while(self.errorMessages.length > 0){
            var errorMessage = self.errorMessages.pop();
            showError(errorMessage);
        }
    });
}]);
