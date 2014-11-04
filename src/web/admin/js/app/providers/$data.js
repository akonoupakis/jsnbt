/* global angular:false */

(function () {
    "use strict";

    angular.defaults = {};
    angular.module("jsnbt")
        .provider("$data", function () {
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
                            params.push(function (result, error) {
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

                    Data.getNames = function () {
                        var names = [];

                        for (var name in angular.defaults)
                            names.push(name);

                        return names;
                    };

                    Data.register = function (name, defaults) {
                        if (!angular.defaults[name]) {
                            angular.defaults[name] = defaults;

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
                        }
                    };

                    Data.create = function (name, obj) {
                        var result = {};

                        var defaults = {};

                        if (angular.defaults[name]) {
                            $.extend(true, defaults, angular.defaults[name]);
                        }

                        $.extend(true, result, defaults, obj);
                        return result;
                    };

                    return Data;
                }
            };
        })
        .run(function ($data) {

            $data.register('users', {
                username: undefined,
                password: undefined,
                firstName: undefined,
                lastName: undefined,
                roles: []
            });
            
            $data.register('nodes', {
                name: '',
                domain: 'core',                
                entity: 'page',
                parent: '',
                published: false,
                content: {
                    localized: {}
                },
                seo: {},
                active: {},
                meta: {},
                createdOn: new Date().getTime(),
                modifiedOn: new Date().getTime(),
                roles: {
                    inherits: true,
                    values: []
                },
                robots: {
                    inherits: true,
                    values: []
                },                
                hierarchy: []
            });

            $data.register('languages', {
                code: '',
                name: '',
                active: false,
                default: false
            });

            $data.register('data', {
                domain: '',
                list: '',
                name: '',
                content: {
                    localized: {}
                },
                createdOn: new Date().getTime(),
                modifiedOn: new Date().getTime(),
                published: false
            });

            $data.register('texts', {
                key: '',
                value: {},
                published: false
            });

            $data.register('settings', {
                domain: '',
                data: {}
            });

        });
        
})();