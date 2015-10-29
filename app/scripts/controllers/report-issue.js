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

    $scope.description = '<p>天殺的這網站是怎樣#@$%!!</p><img src="http://static2.fjcdn.com/thumbnails/comments/5483060+_11224083b0f38dbfdfb203db56bfe1d3.gif" />';
    
    ygFroala.getFroalaOptions().then(function(options){
        $scope.froalaOptions = options;
        $scope.froalaOptions.minHeight = 100;
    });

    // $scope.isSendingLogHistory = false;
    $scope.logs = $log.getHistory('error').concat($log.getHistory('ajax'));
    // Sort logs by timestamp
    $scope.logs.sort(function (log1, log2) {
        return log1.timestamp - log2.timestamp;
    });
    $scope.readableLogs = $scope.logs.map(function (element) {
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
            var issueData = {
                description: $scope.description
            };
            if($scope.isSendingLogHistory){
                issueData.error_logs = $scope.logs;
            }
            $http.post(canReportIssue.url, issueData).then(
            function (response) {
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
