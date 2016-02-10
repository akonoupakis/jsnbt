/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .factory('PagedDataService', ['$q', function ($q) {
            var PagedDataService = {};
            
            var getData = function (fn, query, start, limit, selected) {
                var deferred = $q.defer();

                if (!start)
                    start = 0;

                if (!limit)
                    limit = 50;

                if (limit > 1000)
                    limit = 1000;

                var qry = {
                    $sort: {
                        id: 1
                    }
                };
                angular.extend(qry, query, {
                    $skip: start,
                    $limit: limit
                });

                var params = [qry, function (error, results) {
                    if (error)
                        deferred.reject(error);
                    else {

                        var data = {
                            items: [],
                            more: function () {
                                return getData(fn, query, start + limit, limit, selected);
                            }
                        };

                        $(results).each(function (r, result) {
                            result.$parent = data;
                            result.selected = selected !== undefined && selected.indexOf(result.id) !== -1;
                            data.items.push(result);
                        });

                        deferred.resolve(data);
                    }
                }];
                fn.apply(fn, params);

                return deferred.promise;
            };

            PagedDataService.get = function (options) {
                var deferred = $q.defer();

                var optsQuery = {};
                $.extend(true, optsQuery, options.query);

                if (options.sorter && options.sorter.name && options.sorter.direction) {
                    var sort = {};
                    sort[options.sorter.name] = options.sorter.direction === 'asc' ? 1 : -1;
                    optsQuery['$sort'] = sort
                }

                if (_.isArray(options.filters)) {
                    var filters = [];
                    _.each(options.filters, function (filter) {
                        if (filter.name && (filter.type === 'number' || filter.type ==='date') && _.isArray(filter.expressions) && filter.expressions.length > 0) {
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

                getData(options.fn, optsQuery, options.start, options.limit, options.selected).then(function (results) {
                    deferred.resolve(results);
                }).catch(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            PagedDataService.getSelected = function (data, field) {
                var results = _.pluck(_.filter(data.items, function (x) { return x.selected; }), field || 'id');
                return results;
            };

            PagedDataService.setSelected = function (data, selected, field) {
                $(data.items).each(function (d, ditem) {
                    if(selected.indexOf(ditem[field || 'id']) !== -1)
                        ditem.selected = true;
                });
            };

            return PagedDataService;
        }]);
})();