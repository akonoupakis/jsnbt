/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('FileService', function ($q, $http) {
            var FileService = {};
         
            FileService.get = function (paths) {
                var deferred = $q.defer();

                var url = '../jsnbt-api/core/file';
                $http.post(url, {
                    fn: 'get',
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

                var url = '../jsnbt-api/core/file';
                $http.post(url, {
                    fn: 'create',
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
                
                var url = '../jsnbt-api/core/file';
                $http.post(url, {
                    fn: 'move',
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

                var url = '../jsnbt-api/core/file';
                $http.post(url, {
                    fn: 'delete',
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
        });
})();