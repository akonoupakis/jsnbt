/* global angular:false */

(function () {
    "use strict";

    angular.defaults = {};
    angular.module("jsnbt")
        .provider("$data", [function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $rootScope, AUTH_EVENTS) {
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
                            params.push(function (error, result) {
                                if (error) {
                                    if (error.status) {
                                        if (!double) {

                                            var authCodes = {
                                                401: AUTH_EVENTS.notAuthenticated,
                                                403: AUTH_EVENTS.notAuthorized,
                                                419: AUTH_EVENTS.sessionTimeout,
                                                440: AUTH_EVENTS.sessionTimeout
                                            };

                                            if (authCodes[error.status]) {
                                                $rootScope.$broadcast(authCodes[error.status], function () {
                                                    jsnbt.db[name][fn].apply(jsnbt.db[name], getPromiseParams(true));
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

                        jsnbt.db[name][fn].apply(jsnbt.db[name], getPromiseParams());

                        return deferred.promise;
                    };
                    
                    var collectionNames = Object.keys(jsnbt.collections);
                    _.each(collectionNames, function (collectionName) {

                        Data[collectionName] = {};

                        Data[collectionName].get = function () {
                            return getPromise.apply(getPromise, [collectionName, 'get', arguments]);
                        };
                        
                        Data[collectionName].post = function () {
                            return getPromise.apply(getPromise, [collectionName, 'post', arguments]);
                        };

                        Data[collectionName].put = function () {
                            return getPromise.apply(getPromise, [collectionName, 'put', arguments]);
                        };

                        Data[collectionName].del = function () {
                            return getPromise.apply(getPromise, [collectionName, 'del', arguments]);
                        };

                        Data[collectionName].count = function () {
                            return getPromise.apply(getPromise, [collectionName, 'count', arguments]);
                        };
                    });

                    Data.create = function (name, obj) {
                        var result = {};

                        var defaults = {};

                        if (jsnbt.collections[name] && jsnbt.collections[name].default) {
                            $.extend(true, defaults, jsnbt.collections[name].default);
                        }

                        $.extend(true, result, defaults, obj);
                        return result;
                    };

                    return Data;
                }
            };
        }]);        
})();