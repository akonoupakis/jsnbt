/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$text", function () {

            return {
                
                $get: function ($q) {

                    return {

                        get: function (language, match) {
                            var deferred = $q.defer();

                            var matches = typeof (match) === 'string' ? [match] : match;

                            jsnbt.db.texts.get({
                                $or: [{
                                    key: {
                                        $in: matches
                                    }
                                }, {
                                    group: {
                                        $in: matches
                                    }
                                }]
                            }, function (results, error) {
                                if (error) {
                                    deferred.reject(error);
                                }
                                else {
                                    var returnObj = {};

                                    $(results).each(function (i, item) {
                                        var itemValue = (item.value || {})[language];
                                        if (itemValue) {
                                            if (item.group && item.group !== '') {
                                                returnObj[item.group] = returnObj[item.group] || {};
                                                returnObj[item.group][item.key] = itemValue;
                                            }
                                            else {
                                                returnObj[item.key] = itemValue;
                                            }
                                        }
                                    });

                                    deferred.resolve(returnObj);
                                }
                            })

                            return deferred.promise;
                        }

                    };

                }

            };
        });
})();