﻿/* global angular:false */

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
                $get: function ($q) {
                    var Data = {};

                    var getPromise = function (name, fn, args) {
                        var deferred = $q.defer();

                        var params = [];
                        $(args).each(function (a, arg) {
                            if (typeof (arg) !== 'function')
                                params.push(arg);
                        });
                        params.push(function (result, error) {
                            if (error)
                                deferred.reject(error);
                            else
                                deferred.resolve(result);
                        });

                        dpd[name][fn].apply(dpd[name][fn], params);

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

            $data.register('drafts', {
                refId: '',
                collection: '',
                user: '',
                data: {},
                timestamp: new Date().getTime()
            });

            $data.register('nodes', {
                domain: 'core',
                name: '',
                entity: 'page',
                parent: '',
                hierarchy: [],
                config: {},
                localization: {
                    enabled: true,
                    language: ''
                },
                data: {
                    localized: {}
                },
                createdOn: new Date().getTime(),
                modifiedOn: new Date().getTime()
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
                localization: {
                    enabled: true,
                    language: ''
                },
                data: {
                    localized: {}
                },
                createdOn: new Date().getTime(),
                modifiedOn: new Date().getTime()
            });

            $data.register('texts', {
                key: '',
                value: {}
            });

        });
        
})();