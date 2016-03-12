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
                $get: function ($http, $q, $rootScope, $jsnbt, $cacheFactory, AUTH_EVENTS) {
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
                    
                    var getData = function (collectionObj, options, start, limit) {
                        var deferred = $q.defer();

                        if (!start)
                            start = 0;

                        if (!limit)
                            limit = 50;

                        if (limit > 1000)
                            limit = 1000;

                        var optsQuery = {
                            $sort: {
                                id: 1
                            }
                        };
                        angular.extend(optsQuery, options.query, {
                            $skip: start,
                            $limit: limit
                        });
                        
                        if (options.sorter && options.sorter.name && options.sorter.direction) {
                            var sort = {};
                            sort[options.sorter.name] = options.sorter.direction === 'asc' ? 1 : -1;
                            optsQuery['$sort'] = sort
                        }

                        if (_.isArray(options.filters)) {
                            var filters = [];
                            _.each(options.filters, function (filter) {
                                if (filter.name && (filter.type === 'number' || filter.type === 'date') && _.isArray(filter.expressions) && filter.expressions.length > 0) {
                                    _.each(filter.expressions, function (expression) {
                                        if (expression.term !== undefined && expression.term !== null && expression.term !== NaN) {
                                            if (expression.expression === '=') {
                                                if (filter.type === 'number') {
                                                    var filtOpts = {};
                                                    filtOpts[filter.name] = expression.term;
                                                    filters.push(filtOpts);
                                                }
                                                else if (filter.type === 'date') {

                                                    var dateFrom = new Date(expression.term);
                                                    var dateTo = moment(dateFrom).add(1, 'day')._d;

                                                    var dateFromObj = {};
                                                    dateFromObj[filter.name] = {
                                                        $gte: dateFrom.getTime()
                                                    };
                                                    filters.push(dateFromObj);

                                                    var dateToObj = {};
                                                    dateToObj[filter.name] = {
                                                        $lt: dateTo.getTime()
                                                    };
                                                    filters.push(dateToObj);
                                                }
                                            }
                                            else if (expression.expression === '!=') {
                                                if (filter.type === 'number') {
                                                    var filtOpts = {};
                                                    filtOpts[filter.name] = {
                                                        $ne: expression.term
                                                    };
                                                    filters.push(filtOpts);
                                                }
                                                else if (filter.type === 'date') {
                                                    var dateLess = new Date(expression.term);
                                                    var dateGreater = moment(dateLess).add(1, 'day')._d;

                                                    var dFilters = [];

                                                    var dateLessObj = {};
                                                    dateLessObj[filter.name] = {
                                                        $lt: dateLess.getTime()
                                                    };
                                                    dFilters.push(dateLessObj);

                                                    var dateGreaterObj = {};
                                                    dateGreaterObj[filter.name] = {
                                                        $gte: dateGreater.getTime()
                                                    };
                                                    dFilters.push(dateGreaterObj);

                                                    filters.push({
                                                        $or: dFilters
                                                    });
                                                }
                                            }
                                            else if (expression.expression === '>=') {
                                                var filtOpts = {};
                                                filtOpts[filter.name] = {
                                                    $gte: expression.term
                                                };
                                                filters.push(filtOpts);
                                            }
                                            else if (expression.expression === '>') {
                                                var filtOpts = {};
                                                filtOpts[filter.name] = {
                                                    $gt: expression.term
                                                };
                                                filters.push(filtOpts);
                                            }
                                            else if (expression.expression === '<') {
                                                var filtOpts = {};
                                                filtOpts[filter.name] = {
                                                    $lt: expression.term
                                                };
                                                filters.push(filtOpts);
                                            }
                                            else if (expression.expression === '=<') {
                                                var filtOpts = {};
                                                filtOpts[filter.name] = {
                                                    $lte: expression.term
                                                };
                                                filters.push(filtOpts);
                                            }
                                        }
                                    });
                                }
                                else if (filter.name && filter.type === 'string' && _.isArray(filter.expressions) && filter.expressions.length > 0) {
                                    _.each(filter.expressions, function (expression) {
                                        if (expression.term !== undefined && expression.term.trim() !== '') {
                                            var filtOpts = {};
                                            filtOpts[filter.name] = {
                                                $regex: expression.expression === '!=' ? '^(?!.*' + expression.term + ')' : expression.term,
                                                $options: 'i'
                                            }

                                            filters.push(filtOpts);
                                        }
                                    });
                                }
                                else if (filter.name && filter.type === 'boolean' && _.isArray(filter.expressions) && filter.expressions.length > 0) {
                                    var firstExpression = _.first(filter.expressions);
                                    if (firstExpression) {
                                        var filterValue = firstExpression.expression === '!=' ? !firstExpression.term : firstExpression.term;
                                        var filtOpts = {};
                                        filtOpts[filter.name] = filterValue;
                                        filters.push(filtOpts);
                                    }
                                }
                            });

                            if (filters.length > 0) {
                                $.extend(true, optsQuery, {
                                    $and: filters
                                });
                            }
                        }

                        collectionObj.get(optsQuery).then(function (results) {
                            var data = {
                                items: [],
                                total: 0,
                                more: function () {
                                    return getData(collectionObj, options, start + limit, limit);
                                },
                                get: function (pageNumber) {
                                    var getStart = (pageNumber - 1) * limit;
                                    var getLimit = getStart + limit;
                                    return getData(collectionObj, options, getStart, getLimit);
                                }
                            };

                            $(results).each(function (r, result) {
                                result.$parent = data;
                                data.items.push(result);
                            });

                            if (data.items.length > 0) {
                                var countQry = {};
                                $.extend(true, countQry, optsQuery);
                                delete countQry.$sort;
                                delete countQry.$skip;
                                delete countQry.$limit;
                                collectionObj.count(countQry).then(function(countResult) {
                                    data.total = countResult;
                                    deferred.resolve(data);
                                }).catch(function(countErr){
                                    deferred.reject(countErr);
                                });
                            }
                            else {
                                deferred.resolve(data);
                            }
                        }).catch(function (error) {
                            deferred.reject(error);
                        });

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

                        Data[collectionName].getPage = function (options, start, limit) {
                            return getData(Data[collectionName], options, start, limit);
                        };
                    });

                    if (Data.nodes) {
                        Data.nodes.sort = function (parent, ids) {
                            var deferred = $q.defer();

                            var url = '../jsnbt-api/core/node/sort';
                            $http.post(url, {
                                parent: parent,
                                ids: ids
                            }).then(function (response) {
                                deferred.resolve();
                            }).catch(function (ex) {
                                deferred.reject(ex.data);
                            });

                            return deferred.promise;
                        };
                    }



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