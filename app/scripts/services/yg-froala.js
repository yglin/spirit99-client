'use strict';

/**
 * @ngdoc service
 * @name spirit99App.ygFroala
 * @description
 * # ygFroala
 * Service in the spirit99App.
 */
angular.module('spirit99App')
.service('ygFroala', ['$rootScope', '$q', 'ygServer',
function ($rootScope, $q, ygServer) {
    var self = this;

    self.defaultOptions = {
        inlineMode: true,
        minHeight: 150,
        language: 'zh-tw',
        placeholder: '內文...'
    };

    self.options = null;

    self.getFroalaOptions = function(){
        var defer = $q.defer();
        if(self.options !== null){
            defer.resolve(self.options);
        }
        else{// Build options
            var upload = ygServer.getSupportUpload();
            if(upload){
                if(upload.s3Config){
                    upload.promiseS3Config.then(function () {
                        var imageUploadOptions = {
                            imageUploadToS3: {
                                bucket: upload.s3Config.bucket,
                                region: upload.s3Config.region,
                                keyStart: upload.s3Config.keyStart,
                                callback: function (url, key) {
                                        // The URL and Key returned from Amazon.
                                        console.log (url);
                                        console.log (key);
                                    },
                                params: {
                                    acl: upload.s3Config.acl,
                                    AWSAccessKeyId: upload.s3Config.accessKeyId,
                                    policy: upload.s3Config.policy,
                                    signature: upload.s3Config.signature
                                }
                            }
                        };
                        self.options = angular.extend(self.defaultOptions, imageUploadOptions);
                        // console.log(self.options);
                        defer.resolve(self.options);
                    }, function (error) {
                        console.log(error);
                        defer.resolve(self.defaultOptions);
                    });
                }
                else if(upload.url){
                    var imageUploadOptions = {
                        imageUploadURL: upload.url
                    };
                    if(upload.paramName){
                        imageUploadOptions.imageUploadParam = upload.paramName;
                    }            
                    self.options = angular.extend(self.defaultOptions, imageUploadOptions);
                    defer.resolve(self.options);
                }
                else{
                    self.options = self.defaultOptions;
                    defer.resolve(self.options);
                }
            }else{
                self.options = self.defaultOptions;
                defer.resolve(self.options);
            }
        }
        return defer.promise;
    };

    $rootScope.$watch(function () {
        return ygServer.selectedServer;
    }, function () {
        self.options = null;
    });

}]);
