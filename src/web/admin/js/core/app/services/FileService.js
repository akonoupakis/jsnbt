/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FileService', ['$q', '$http', function ($q, $http) {
            var FileService = {};
         
            FileService.get = function (paths) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/file/get';
                $http.post(url, {
                    path: typeof (paths) === 'string' ? paths : undefined,
                    paths: typeof (paths) !== 'string' ? paths : undefined
                }).then(function (data) {
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

                var url = '../jsnbt-api/core/file/create';
                $http.post(url, {
                    path: path,
                    name: name
                }).then(function (data) {
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
                
                var url = '../jsnbt-api/core/file/move';
                $http.post(url, {
                    from: path,
                    to: newPath
                }).then(function (data) {
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

                var url = '../jsnbt-api/core/file/delete';
                $http.post(url, {
                    path: path
                }).then(function (data) {
                    if (!!data && !!data.data) {
                        deferred.resolve(data.data.d);
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            return FileService;
        }]);
})();