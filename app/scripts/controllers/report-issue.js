'use strict';

/**
 * @ngdoc function
 * @name spirit99App.controller:ReportIssueCtrl
 * @description
 * # ReportIssueCtrl
 * Controller of the spirit99App
 */
angular.module('spirit99App')
.controller('ReportIssueController', ['$scope', '$log', '$http', '$window', '$mdDialog', 'ygFroala', 'ygServer',
function ($scope, $log, $http, $window, $mdDialog, ygFroala, ygServer) {

    
    ygFroala.getFroalaOptions().then(function(options){
        $scope.froalaOptions = options;
        $scope.froalaOptions.minHeight = 100;
    });
    $scope.issue = {
        description: '<p>天殺的這網站是怎樣#@$%!!</p><img src="http://static2.fjcdn.com/thumbnails/comments/5483060+_11224083b0f38dbfdfb203db56bfe1d3.gif" />'
    };

    // $scope.isSendingLogHistory = false;
    $scope.issue.error_logs = $log.getHistory('error').concat($log.getHistory('ajax'));
    // Sort logs by timestamp
    $scope.issue.error_logs.sort(function (log1, log2) {
        return log1.timestamp - log2.timestamp;
    });
    $scope.readableLogs = $scope.issue.error_logs.map(function (element) {
        return {
            timestamp: element.timestamp.toLocaleString(),
            context: angular.toJson(element.context)
        };
    });

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.confirm = function () {
        var canReportIssue = ygServer.getSupportReportIssue();
        if(!canReportIssue){
            $window.alert('電台不支援問題回報功能');
        }
        else{
            // console.log($scope.issue.description);
            if(!$scope.isSendingLogHistory){
                $scope.issue.error_logs = [];
            }
            $http.post(canReportIssue.url, $scope.issue).then(
            function (response) {
                $window.alert('問題已成功回報，感謝您為網站的進步盡一份心力:)');
                $log.info('Issue reported: ');
                $log.info(response);
            },
            function (error) {
                $window.alert('問題回報失敗');
                $log.error('Issuse report failed: ');
                $log.error(error);
            });
        }
        $mdDialog.hide();
    };
}]);
