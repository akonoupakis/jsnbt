/* global angular:false */

(function () {
    "use strict";

    angular.providers = {};
    angular.module("jsnbt")
        .provider("$fn", function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $jsnbt) {
                    var Function = {};

                    var findFn = function (obj, fn) {
                        var pathParts = fn.split('.');
                        var loopObject;

                        loopObject = obj;
                        var exists = true;
                        for (var i = 0; i < pathParts.length; i++) {
                            if (loopObject[pathParts[i]]) {
                                loopObject = loopObject[pathParts[i]];
                            }
                            else {
                                exists = false;
                                break;
                            }
                        }

                        return exists === true ? loopObject : undefined;
                    };

                    var getFn = function (domain, fn, cascade) {
                        //var module = _.first(_.filter($jsnbt.modules, function (x) { return x.domain === domain; }));
                        var loopObject;
                        var coreDomain = 'core';
                        if (angular.providers[domain]) {
                            loopObject = findFn(angular.providers[domain], fn);
                            if (typeof (loopObject) !== 'function' && cascade) {
                                loopObject = findFn(angular.providers[coreDomain], fn);
                            }
                        }
                        else {
                            if (cascade)
                                loopObject = findFn(angular.providers[coreDomain], fn);
                        }

                        return loopObject;
                    };

                    Function.invoke = function (domain, fn, args, cascade) {
                        if (cascade === undefined)
                            cascade = true;

                        var func = getFn(domain, fn, cascade);
                        if (func !== undefined && typeof (func) === 'function') {
                            return func.apply(func, args);
                        }
                    };

                    Function.register = function (domain, obj) {
                        if (!angular.providers[domain]) {
                            angular.providers[domain] = obj;
                        }
                    };

                    Function.array = {

                        select: function (items, cb) {
                            var results = [];
                            $(items).each(function (i, item) {
                                results.push(cb(item));
                            });
                            return results;
                        }

                    };

                    return Function;
                }
            };
        });
        
})();