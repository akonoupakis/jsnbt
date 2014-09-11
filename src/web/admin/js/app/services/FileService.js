/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FileService', function ($q, $http) {
            var FileService = {};
         
            FileService.get = function (paths) {
                var deferred = $q.defer();

                var url = '../jsnbt-service/file/?fn=get&path=' + JSON.stringify(typeof (paths) === 'string' ? paths : paths);
                $http.get(url).then(function (data) {
                    if (!!data && !!data.data) {                        
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            FileService.create = function (path, name) {
                var deferred = $q.defer();

                var url = '../jsnbt-service/file/?fn=create&path=' + path + '&name=' + name;
                $http.get(url).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            FileService.move = function (path, newPath) {
                var deferred = $q.defer();
                
                var url = '../jsnbt-service/file/?fn=move&path=' + path + '&newPath=' + newPath;
                $http.get(url).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };
            
            FileService.delete = function (path) {
                var deferred = $q.defer();

                var url = '../jsnbt-service/file/?fn=delete&path=' + path;
                $http.get(url).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            return FileService;
        });
})();