'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygProgress
 * @description
 * # ygProgress
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygProgress', ['$mdDialog', function ($mdDialog) {
// AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    self.circularProgress = {
        templateUrl: 'views/progress.html',
        controller: 'ProgressController',
        locals: {
            message: '背景作業中...'
        },
    };

    self.show = function(message, promise){
        var options = {};
        if(message){
            options = angular.copy(self.circularProgress);
            options.locals.message = message;
        }
        else{
            options = options.circularProgress;
        }
        var dialog = $mdDialog.show(options);
        $mdDialog.hide();
    };
}]);
