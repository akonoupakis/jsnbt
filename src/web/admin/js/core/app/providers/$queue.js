/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$queue", [function () {
            var settings = {};

            return {
                setSettings: function (value) {
                    settings = value;
                },
                $get: function ($q, $http) {

                    var current = {};
                    
                    var processFn = function (name, force) {
                        if (force)
                            if (!current[name].processing)
                                return;

                        if (current[name].fn.length > 0) {
                            var fn = current[name].fn.shift();
                            if (fn) {
                                current[name].processing = true;
                                fn().then(function () {
                                    if (current[name].fn.length > 0) {
                                        processFn(name, force);
                                    }
                                    else {
                                        current[name].processing = false;
                                    }
                                }, function (error) {
                                    current[name].processing = false;
                                    throw error;
                                });
                            }
                            else {
                                current[name].processing = false;
                            }
                        }
                    };

                    var Queue = {};
                    
                    Queue.enqueue = function (name, fn) {
                        
                        if (!current[name]) {
                            current[name] = {
                                fn: [],
                                processing: false
                            };
                        }

                        current[name].fn.push(fn);

                        processFn(name);

                    };

                    return Queue;
                }
            };
        }]);
})();