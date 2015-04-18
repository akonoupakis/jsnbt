﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$data", function () {

            return {

                $get: function ($q, $rootScope) {

                    var Data = {};
                   
                    var getPromise = function (name, fn, args, double) {
                        var deferred = $q.defer();

                        var promiseArgs = args;

                        var getPromiseParams = function () {
                            var params = [];
                            $(promiseArgs).each(function (a, arg) {
                                if (typeof (arg) !== 'function')
                                    params.push(arg);
                            });
                            params.push(function (result, error) {
                                if (error) {
                                    if (error.status) {
                                        if (!double) {

                                            var authCodes = {
                                                401: 'notAuthenticated',
                                                403: 'notAuthorized',
                                                419: 'sessionTimeout',
                                                440: 'sessionTimeout'
                                            };

                                            if (authCodes[error.status]) {
                                                $rootScope.$broadcast(authCodes[error.status], function () {
                                                    dpd[name][fn].apply(dpd[name][fn], getPromiseParams(true));
                                                });
                                            }
                                            else {
                                                deferred.reject(error);
                                            }
                                        }
                                        else {
                                            deferred.reject(error);
                                        }
                                    }
                                    else {
                                        deferred.reject(error);
                                    }
                                }
                                else {
                                    deferred.resolve(result);
                                }
                            });
                            return params;
                        };

                        dpd[name][fn].apply(dpd[name][fn], getPromiseParams());

                        return deferred.promise;
                    };

                    var register = function (name) {
                        Data[name] = {};

                        Data[name].get = function () {
                            return getPromise.apply(getPromise, [name, 'get', arguments]);
                        };

                        Data[name].post = function () {
                            return getPromise.apply(getPromise, [name, 'post', arguments]);
                        };

                        Data[name].put = function () {
                            return getPromise.apply(getPromise, [name, 'put', arguments]);
                        };

                        Data[name].del = function () {
                            return getPromise.apply(getPromise, [name, 'del', arguments]);
                        };
                    };

                    for (var dpdName in dpd) {
                        register(dpdName);
                    }

                    return Data;
                }
            };
        });
        
})();