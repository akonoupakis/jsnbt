/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodeController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $q, $queue, $data, ScrollSpyService, $fn, LocationService, DraftService, FORM_EVENTS) {

            var logger = $logger.create('TextController');

            $scope.id = $routeParams.id;
            $scope.name = undefined;
            $scope.node = undefined;
            $scope.siblings = [];
            $scope.seoNames = [];

            $scope.types = [];
            $scope.languages = [];
            $scope.views = [];
            $scope.addons = [];

            $scope.localized = false;
            $scope.language = undefined;

            $scope.valid = false;
            $scope.uniqueSeo = true;
            $scope.published = false;

            $scope.tmpl = null;

            $scope.parentOptions = {
                restricted: [],
                entities: []
            };

            $scope.tinymceOptions = {
                resize: false,
                height: '500px'
            };

            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.nodes.get($scope.id).then(function (result) {

                        var setInternal = function (published, data, node) {
                            $scope.name = data.name;
                            $scope.node = data;
                            $scope.localized = (data.localization || {}).enabled;

                            $scope.node.parent = node.parent;
                            $scope.node.hierarchy = node.hierarchy;

                            $scope.parentOptions.restricted = [$scope.id];
                                
                            $data.nodes.get({ parent: node.parent, id: { $nin: [$scope.id] }, domain: node.domain }).then(function (siblingsResponse) {
                                    
                                $scope.siblings = siblingsResponse;                                    
                                $scope.valid = true;
                                $scope.published = published;

                                deferred.resolve(data);

                            }, function (siblingsError) {
                                deferred.reject(siblingsError);
                            });
                        };

                        DraftService.get('nodes', $scope.id).then(function (draftResult) {
                            setInternal(draftResult === undefined, draftResult || result, result);
                        }, function (draftError) {
                            deferred.reject(draftError);
                        });

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    if (breadcrumb[0].name === 'addons') {
                        breadcrumb = breadcrumb.slice(0, 3);
                    }
                    else
                        breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);

                    $scope.current.setBreadcrumb(breadcrumb);

                    if ($scope.node) {
                        var currentUrl = _.pluck(breadcrumb, 'name').join('/');
                        $data.nodes.get({ id: { $in: $scope.node.hierarchy } }).then(function (results) {

                            $($scope.node.hierarchy).each(function (i, item) {
                                var resultNode = _.first(_.filter(results, function (x) { return x.id === item; }));
                                breadcrumb.push({
                                    name: resultNode ? resultNode.name : '-',
                                    url: currentUrl + '/' + item,
                                    active: i === ($scope.node.hierarchy.length - 1)
                                });
                            });

                            $scope.current.setBreadcrumb(breadcrumb);

                            deferred.resolve(breadcrumb);

                        }, function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        deferred.resolve(breadcrumb);
                    }

                    return deferred.promise;
                },

                setLanguage: function () {
                    var deferred = $q.defer();

                    var result = $scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code;

                    $scope.language = result;

                    deferred.resolve(result);

                    return deferred.promise;
                },

                setLanguages: function () {
                    var deferred = $q.defer();

                    var results = $scope.application.languages;

                    $scope.languages = results;

                    deferred.resolve(results);

                    return deferred.promise;
                },

                setParentEntities: function () {
                    var deferred = $q.defer();

                    var parentEntities = _.pluck(_.filter(jsnbt.entities, function (x) { return x.allowed && x.allowed.indexOf($scope.node.entity) !== -1; }), 'name');

                    $scope.parentOptions.entities = parentEntities;

                    deferred.resolve(parentEntities);

                    return deferred.promise;
                },

                setTmpl: function () {
                    var deferred = $q.defer();

                    if ($scope.node && $scope.node.entity === 'page') {
                        var spec = _.find($scope.views, function (x) { return x.tmpl === $scope.node.view; });
                        if (spec)
                            $scope.tmpl = spec.spec;
                        else {
                            $scope.tmpl = null;
                        }
                    }
                    
                    deferred.resolve();                    

                    return deferred.promise;
                },

                setTypes: function () {
                    var deferred = $q.defer();

                    var types = [];
                    types.push({ value: 'page', name: 'CMS Page' });
                    if (jsnbt.addons.length > 0)
                        types.push({ value: 'pointer', name: 'Addon Pointer' });
                    types.push({ value: 'link', name: 'External Link' });

                    $scope.types = types;

                    deferred.resolve(types);

                    return deferred.promise;
                },

                setViews: function () {
                    var deferred = $q.defer();

                    var views = [];
                    $(jsnbt.views).each(function (t, template) {
                        var tmpl = {};
                        $.extend(true, tmpl, template);
                        views.push(tmpl);
                    });
                    $scope.views = views;

                    deferred.resolve(views);

                    return deferred.promise;
                },

                setAddons: function () {
                    var deferred = $q.defer();

                    var addons = [];
                    $(jsnbt.addons).each(function (a, addon) {
                        addons.push({
                            name: addon.name,
                            domain: addon.domain
                        });
                    });
                    $scope.addons = addons;

                    deferred.resolve(addons);

                    return deferred.promise;
                },

                setSpy: function (time) {
                    var deferred = $q.defer();

                    ScrollSpyService.get(time || 0).then(function (response) {
                        $scope.nav = response;
                        deferred.resolve(response);
                    });

                    return deferred.promise;
                },

                setSeo: function () {
                    var deferred = $q.defer();

                    if ($scope.node && $scope.node.parent && $scope.node.parent !== '') {
                        $data.nodes.get({ id: $scope.node.parent }).then(function (parentResult) {
                            var nodeIds = parentResult.hierarchy;

                            if (nodeIds.length > 0) {
                                $data.nodes.get({ id: { $in: nodeIds } }).then(function (results) {
                                    var newSeoNodes = [];

                                    $(nodeIds).each(function (n, nodeId) {
                                        var result = _.find(results, function (x) { return x.id === nodeId; });
                                        if (result) {
                                            var newSeoNode = {};

                                            $($scope.application.languages).each(function (l, lang) {
                                                if (result.data.localized[lang.code])
                                                    newSeoNode[lang.code] = result.data.localized[lang.code].seoName;
                                            });

                                            newSeoNodes.push(newSeoNode);
                                        }
                                        else {
                                            newSeoNodes.push({});
                                        }
                                    });

                                    $scope.seoNames = newSeoNodes;

                                    deferred.resolve(newSeoNodes);

                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $scope.seoNames = [];
                                deferred.resolve([]);
                            }
                        }, function (parentError) {
                            deferred.reject(parentError);
                        });
                    }
                    else {
                        deferred.resolve([]);
                    }

                    return deferred.promise;
                },

                save: function () {
                    var deferred = $q.defer();

                    $queue.enqueue('TextController:' + $scope.id + ':save', function () {
                        var d = $q.defer();
                        DraftService.set('nodes', $scope.id, $scope.node).then(function (response) {
                            d.resolve(response);
                        }, function (error) {
                            d.reject(error);
                        });
                        return d.promise;
                    });

                    deferred.resolve();

                    return deferred.promise;
                },

                discard: function () {
                    var deferred = $q.defer();

                    DraftService.clear('nodes', $scope.id).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },
                
                validate: function () {
                    var deferred = $q.defer();

                    $scope.valid = true;
                    $scope.uniqueSeo = true;
                    $scope.$broadcast(FORM_EVENTS.initiateValidation);

                    if (!$scope.valid) {
                        deferred.resolve(false);
                    }
                    else {
                        if ($scope.localized) {

                            var checkLanguage = function (lang, next) {
                                $scope.language = lang.code;

                                $timeout(function () {
                                    $scope.$broadcast(FORM_EVENTS.initiateValidation);

                                    if (!$scope.valid) {
                                        deferred.resolve(false);
                                    }
                                    else {
                                        next();
                                    }
                                }, 50);
                            };

                            var currentLanguage = $scope.language;
                            var restLanguages = _.filter($scope.languages, function (x) { return x.active && x.code !== currentLanguage; });
                            if (restLanguages.length > 0) {
                                var nextIndex = 0;
                                var next = function () {
                                    nextIndex++;

                                    var lang = restLanguages[nextIndex];
                                    if (lang) {
                                        checkLanguage(lang, next);
                                    }
                                    else {
                                        $scope.language = currentLanguage;

                                        deferred.resolve(true);
                                    }
                                };

                                var first = _.first(restLanguages);
                                checkLanguage(first, next);
                            }
                            else {
                                deferred.resolve(true);
                            }
                        }
                        else {
                            deferred.resolve(true);
                        }
                    }

                    return deferred.promise;
                },

                publish: function () {
                    var deferred = $q.defer();

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            $('body').scrollTo($('.ctrl.invalid:visible:first'), { offset: -150, duration: 400 });
                            deferred.resolve(false);
                        }
                        else {
                            $data.nodes.put($scope.id, $scope.node).then(function (result) {
                                $scope.name = result.name;

                                DraftService.clear('nodes', $scope.id).then(function (delResponse) {
                                    deferred.resolve(true);
                                }, function (delError) {
                                    deferred.reject(delError);
                                });
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };

            $scope.validateSeo = function (name) {

                var valid = true;

                var seoNames = _.pluck(_.pluck(_.pluck(_.pluck(_.filter($scope.siblings, function (x) { return x.data && x.data.localized && x.data.localized[$scope.language]; }), 'data'), 'localized'), $scope.language), 'seoName');

                valid = seoNames.indexOf(name) === -1;
                $scope.uniqueSeo = valid;

                return valid;
            };


            $scope.back = function () {
                if ($rootScope.location.previous) {
                    $location.previous($rootScope.location.previous);
                }
                else {
                    $location.previous($fn.invoke($scope.node.domain, 'url.getBackUrl', [$scope.node]));
                }
            };

            $scope.discard = function () {
                fn.discard().then(function () {
                    fn.set().then(function () { }, function (setError) {
                        logger.error(setError);
                    });
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.preview = function () {

            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('tmpl', function (newValue, prevValue) {
                fn.setSpy(200).then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('node.entity', function () {
                if ($scope.node) {

                    fn.setParentEntities().then(function () {
                        fn.setTmpl().then(function () {
                            fn.setSpy(200);
                        }, function (tmplEx) {
                            logger.error(tmplEx);
                        });
                    }, function (ex) {
                        logger.error(ex);
                    });
                }
            });

            $scope.$watch('node.view', function () {
                fn.setTmpl().then(function () {
                    fn.setSpy(200);
                }, function (ex) {
                    logger.error(ex);
                });
            });
            
            $scope.$watch('node.parent', function () {
                if (!$scope.node)
                    return;

                fn.setSeo().then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('node.pointer.domain', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    $scope.node.pointer.nodeId = '';

                    fn.save().then(function () {
                        $scope.published = false;
                    }, function (ex) {
                        logger.error(ex);
                    });
                }
            });
            
            $scope.$on(FORM_EVENTS.valueChanged, function (sender) {
                sender.stopPropagation();
                
                fn.save().then(function () {
                    $scope.published = false;
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on(FORM_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });


            $timeout(function () {
                fn.setAddons().then(function (addonsResponse) {
                    fn.setLanguages().then(function (languagesResponse) {
                        fn.setLanguage().then(function (languageResponse) {
                            fn.setTypes().then(function (typesResponse) {
                                fn.setViews().then(function (viewsResponse) {
                                    fn.set().then(function (setResponse) {
                                        fn.setTmpl().then(function (tmplResponse) {
                                        }, function (tmplError) {
                                            logger.error(tmplError);
                                        });
                                    }, function (setError) {
                                        logger.error(setError);
                                    });
                                }, function (viewsError) {
                                    logger.error(viewsError);
                                });
                            }, function (typesError) {
                                logger.error(typesError);
                            });
                        }, function (languageError) {
                            logger.error(languageError);
                        });
                    }, function (languagesError) {
                        logger.error(languagesError);
                    });
                }, function (addonsError) {
                    logger.error(addonsError);
                });
            }, 200);

        });
})();