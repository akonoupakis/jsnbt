/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodeController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $q, $queue, $data, $route, $jsnbt, ScrollSpyService, $fn, LocationService, AuthService, DATA_EVENTS, CONTROL_EVENTS) {

            var logger = $logger.create('NodeController');

            $scope.id = $routeParams.id;
            $scope.name = undefined;
            $scope.node = undefined;
            $scope.entity = undefined;
            
            $scope.roles = [];
            $scope.nodeRoles = [];
            $scope.draftRoles = [];

            $scope.robots = [];
            $scope.nodeRobots = [];
            $scope.draftRobots = [];

            $scope.layouts = [];
            $scope.nodeLayout = '';
            $scope.draftLayout = '';

            $scope.seoNames = [];
            
            $scope.siblingSeoNames = [];

            $scope.types = [];
            $scope.languages = [];
            $scope.templates = [];
            $scope.modules = [];

            $scope.localized = false;
            $scope.language = undefined;

            $scope.valid = true;
            $scope.validation = {
                seo: true
            };

            $scope.published = true;

            $scope.tmpl = null;
            
            var tmpls = [];

            if ($route.current.$$route.tmpl) {
                if (typeof ($route.current.$$route.tmpl) === 'string') {
                    tmpls.push($route.current.$$route.tmpl);
                }
                else {
                    $($route.current.$$route.tmpl).each(function (i, item) {
                        tmpls.push(item);
                    });
                }
            }

            $scope.tmpls = tmpls;

            $scope.parentOptions = {
                restricted: [],
                entities: []
            };
           
            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.nodes.get($scope.id).then(function (result) {

                        $scope.node = result;

                        if ($route.current.$$route.name && result.content.localized['en'] && result.content.localized['en'][$route.current.$$route.name]) {
                            $scope.name = result.content.localized['en'][$route.current.$$route.name];
                        }
                        else {
                            $scope.name = result.name;
                        }

                        var entity = _.first(_.filter($jsnbt.entities, function (x) { return x.name === result.entity; }));

                        $scope.localized = $scope.application.localization.enabled && (entity.localized === undefined || entity.localized === true);

                        $scope.parentOptions.restricted = [$scope.id];

                        $scope.valid = true;
                        $scope.published = true;

                        $scope.nodeLayout = result.layout.value;
                        $scope.draftLayout = result.layout.value;

                        $scope.nodeRoles = result.roles.values;
                        $scope.draftRoles = result.roles.values;

                        $scope.nodeRobots = result.robots.values;
                        $scope.draftRobots = result.robots.values;
                        
                        deferred.resolve(result);
                        
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    if ($route.current.$$route.location && $route.current.$$route.location.offset) {
                        breadcrumb = breadcrumb.slice(0, $route.current.$$route.location.offset);
                    }
                    else
                        breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);

                    $scope.current.setBreadcrumb(breadcrumb);

                    if ($scope.node) {
                        var currentUrl = _.pluck(breadcrumb, 'name').join('/');

                        var setLocInternal = function (hierarchy) {
                            $data.nodes.get({ id: { $in: hierarchy } }).then(function (results) {

                                $(hierarchy).each(function (i, item) {
                                    var resultNode = _.first(_.filter(results, function (x) { return x.id === item; }));
                                    if (resultNode) {

                                        var nameValue = resultNode.name;

                                        if ($route.current.$$route.name && resultNode.content.localized['en'] && resultNode.content.localized['en'][$route.current.$$route.name]) {
                                            nameValue = resultNode.content.localized['en'][$route.current.$$route.name];
                                        }

                                        breadcrumb.push({
                                            name: nameValue,
                                            url: currentUrl + '/' + item,
                                            active: i === (hierarchy.length - 1)
                                        });
                                    }
                                });

                                $scope.current.setBreadcrumb(breadcrumb);
                                deferred.resolve(breadcrumb);

                            }, function (error) {
                                deferred.reject(error);
                            });
                        };

                        var hierarchy = [];
                        if ($scope.node.parent && $scope.node.parent !== '') {
                            $data.nodes.get($scope.node.parent).then(function (parentResult) {
                                hierarchy = parentResult.hierarchy.slice(0);
                                hierarchy.push($scope.node.id);

                                setLocInternal(hierarchy);
                            }, function (parentError) {
                                deferred.reject(parentError);
                            });
                        }
                        else {
                            hierarchy = [$scope.node.id];

                            setLocInternal(hierarchy);
                        }                       
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

                setLayouts: function () {
                    var deferred = $q.defer();
      
                    var layouts = [];
                    for (var layoutName in $jsnbt.layouts) {
                        layouts.push({
                            name: layoutName
                        });
                    }

                    $scope.layouts = layouts;

                    deferred.resolve(layouts);

                    return deferred.promise;
                },

                setRoles: function () {
                    var deferred = $q.defer();

                    var allRoles = [];
                    
                    $($jsnbt.roles).each(function (r, role) {
                        if (!AuthService.isInRole({ roles: [role.name] }, 'admin')) {
                            var newRole = {};
                            $.extend(true, newRole, role);
                            newRole.value = newRole.name;
                            newRole.disabled = !AuthService.isInRole($scope.current.user, role.name);
                            newRole.description = role.inherits.length > 0 ? 'inherits from ' + role.inherits.join(', ') : '';
                            allRoles.push(newRole);
                        }
                    });
                    
                    $scope.roleOptions = allRoles;
                    
                    deferred.resolve(allRoles);

                    return deferred.promise;
                },

                setRobots: function () {
                    var deferred = $q.defer();
      
                    var robots = [{
                        name: 'noindex',
                        value: 'noindex',
                        description: 'do not index this page'
                    }, {
                        name: 'nofollow',
                        value: 'nofollow',
                        description: 'do not follow any links'
                    }, {
                        name: 'noarchive',
                        value: 'noarchive',
                        description: 'do not show a "Cached" link'
                    }, {
                        name: 'nosnipet',
                        value: 'nosnipet',
                        description: 'do not show a snippet'
                    }, {
                        name: 'notranslate',
                        value: 'notranslate',
                        description: 'do not offer translation'
                    }, {
                        name: 'noimageindex',
                        value: 'noimageindex',
                        description: 'do not index images'
                    }];

                    $scope.robots = robots;

                    deferred.resolve(robots);

                    return deferred.promise;
                },

                getHierarchyNodes: function () {
                    var deferred = $q.defer();

                    var hierarchyNodeIds = _.filter($scope.node.hierarchy, function (x) { return x !== $scope.id; });
                    $data.nodes.get({ id: { $in: hierarchyNodeIds } }).then(function (nodes) {

                        var hierarchyNodes = [];

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                hierarchyNodes.push(matchedNode);
                            }
                        });

                        deferred.resolve(hierarchyNodes);

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setSelectedLayout: function (hierarchyNodes) {
                    var deferred = $q.defer();

                    if ($scope.node.layout.inherits) {
                        $scope.draftLayout = $scope.nodeLayout;

                        var layout = '';

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(hierarchyNodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.layout.inherits) {
                                    layout = matchedNode.layout.value;
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        $scope.nodeLayout = layout;
                        deferred.resolve(layout);
                    }
                    else {
                        $scope.nodeLayout = $scope.draftLayout;
                        deferred.resolve($scope.nodeLayout);
                    }

                    return deferred.promise;
                },

                setSelectedRoles: function (hierarchyNodes) {
                    var deferred = $q.defer();

                    if ($scope.node.roles.inherits) {
                        $scope.draftRoles = $scope.nodeRoles.slice(0);

                        var roles = [];

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(hierarchyNodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.roles.inherits) {
                                    roles = matchedNode.roles.values.slice(0);
                                }
                            }
                            else {
                                return false;
                            }
                        });
                                
                        $scope.nodeRoles = roles;
                        deferred.resolve(roles);
                    }
                    else {
                        var roles = $scope.draftRoles.slice(0);
                        $scope.nodeRoles = roles;
                        deferred.resolve(roles);
                    }

                    return deferred.promise;
                },

                setSelectedRobots: function (hierarchyNodes) {
                    var deferred = $q.defer();

                    if ($scope.node.robots.inherits) {
                        $scope.draftRobots = $scope.nodeRobots.slice(0);

                        var robots = [];

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(hierarchyNodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.robots.inherits) {
                                    robots = matchedNode.robots.values.slice(0);
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        $scope.nodeRobots = robots;
                        deferred.resolve(robots);
                    }
                    else {
                        var robots = $scope.draftRobots.slice(0);
                        $scope.nodeRobots = robots;
                        deferred.resolve(robots);
                    }

                    return deferred.promise;
                },

                setParentEntities: function () {
                    var deferred = $q.defer();

                    var parentEntities = _.pluck(_.filter($jsnbt.entities, function (x) { return x.allowed && x.allowed.indexOf($scope.node.entity) !== -1; }), 'name');

                    $scope.parentOptions.entities = parentEntities;

                    deferred.resolve(parentEntities);

                    return deferred.promise;
                },
                                
                setTmpl: function () {
                    var deferred = $q.defer();

                    if ($scope.node && $scope.node.entity !== 'pointer') {
                        var spec = _.find($jsnbt.templates, function (x) { return x.path === $scope.node.template; });
                        if (spec) {
                            $scope.tmpl = spec.spec;
                        }
                        else {
                            $scope.tmpl = undefined;
                        }
                    }
                    else {
                        $scope.tmpl = undefined;
                    }
                    
                    deferred.resolve();                    

                    return deferred.promise;
                },

                setTypes: function () {
                    var deferred = $q.defer();

                    var types = [];
                    types.push({ value: 'page', name: 'page' });
                    if (_.filter($jsnbt.modules, function (x) { return x.type === 'addon' && x.pointed === true; }).length > 0)
                        types.push({ value: 'pointer', name: 'pointer' });

                    $scope.types = types;

                    deferred.resolve(types);

                    return deferred.promise;
                },

                setViews: function () {
                    var deferred = $q.defer();

                    var templates = [];
                    $($jsnbt.templates).each(function (t, template) {
                        var tmpl = {};
                        $.extend(true, tmpl, template);

                        var include = false;

                        if (tmpl.restricted) {
                            if (tmpl.restricted.indexOf($scope.node.entity) !== -1) {
                                templates.push(tmpl);
                            }
                        }                        
                        else {
                            templates.push(tmpl);
                        }
                    });

                    $scope.templates = templates;

                    if (_.filter($scope.templates, function (x) { return x.path === $scope.node.template; }).length === 0) {
                        $scope.node.template = '';
                    }

                    deferred.resolve(templates);

                    return deferred.promise;
                },

                setModules: function () {
                    var deferred = $q.defer();

                    var modules = [];
                    $($jsnbt.modules).each(function (a, module) {
                        if (module.pointed) {
                            modules.push({
                                name: module.name,
                                domain: module.domain
                            });
                        }
                    });
                    $scope.modules = modules;

                    deferred.resolve(modules);

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

                                            $($scope.application.localization.enabled ? $scope.application.languages: ['en']).each(function (l, lang) {
                                                if (result.seo[lang.code])
                                                    newSeoNode[lang.code] = result.seo[lang.code];
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

                    $scope.published = false;

                    deferred.resolve();

                    return deferred.promise;
                },

                discard: function () {
                    var deferred = $q.defer();

                    this.set().then(function (response) {
                        deferred.resolve();
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },
                
                validate: function () {
                    var deferred = $q.defer();

                    var me = this;

                    var checkExtras = function (lang) {

                        var deferredInternal = $q.defer();

                        if ($scope.node.active[lang]) {
                            if ($scope.entity.seo) {
                                $data.nodes.get({ parent: $scope.node.parent, domain: $scope.node.domain, id: { $nin: [$scope.id] } }).then(function (siblingsResponse) {

                                    $scope.siblingSeoNames = _.pluck(_.pluck(_.filter(siblingsResponse, function (x) { return x.seo[lang]; }), 'seo'), lang);

                                    $scope.validation.seo = $scope.node.seo[lang] && $scope.siblingSeoNames.indexOf($scope.node.seo[lang]) === -1;

                                    if (!$scope.validation.seo)
                                        $scope.valid = false;

                                    deferredInternal.resolve($scope.valid);

                                }, function (siblingsError) {
                                    deferredInternal.reject(siblingsError);
                                });
                            }
                            else {
                                deferredInternal.resolve($scope.valid);
                            }
                        }
                        else {
                            deferredInternal.resolve($scope.valid);
                        }

                        return deferredInternal.promise;
                    };

                    $scope.valid = true;
                    $scope.validation.seo = true;

                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

                    if (!$scope.valid) {
                        deferred.resolve(false);
                    }
                    else {

                        checkExtras($scope.language).then(function (validationResults) {

                            if (!validationResults) {
                                deferred.resolve(false);
                            }
                            else {

                                if ($scope.localized) {

                                    var checkLanguage = function (lang, next) {
                                        $scope.language = lang.code;

                                        $timeout(function () {
                                        
                                            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

                                            checkExtras(lang.code).then(function (internalValidationResults) {
                                                if (!$scope.valid)
                                                    deferred.resolve(false);
                                                else
                                                    next();
                                            }, function (internalValidationError) {
                                                throw internalValidationError;
                                            });

                                        }, 50);
                                    };

                                    var currentLanguage = $scope.language;
                                    var restLanguages = _.filter($scope.languages, function (x) { return x.active && x.code !== currentLanguage && $scope.node.active[x.code]; });
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

                        }, function (validationError) {
                            deferred.reject(validationError);
                        });
                       
                    }

                    return deferred.promise;
                },

                publish: function () {
                    var deferred = $q.defer();

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            deferred.resolve(false);
                        }
                        else {
                            $scope.node.published = true;

                            var publishNode = {};
                            $.extend(true, publishNode, $scope.node);

                            publishNode.roles.values = !publishNode.roles.inherits ? $scope.nodeRoles : [];
                            publishNode.robots.values = !publishNode.robots.inherits ? $scope.nodeRobots : [];
                            publishNode.layout.value = !publishNode.layout.inherits ? $scope.nodeLayout : '';

                            $data.nodes.put($scope.id, publishNode).then(function (result) {
                                $scope.name = result.name;
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };
            

            $scope.validateSeo = function (value) {
                var valid = true;

                if ($scope.entity.seo) {
                    valid = $scope.siblingSeoNames.indexOf(value) === -1;
                    $scope.validation.seo = valid;
                }

                return valid;
            };

            $scope.editPointee = function () {
                var targetNode = $data.nodes.get($scope.node.pointer.nodeId).then(function (node) {
                    $location.next($fn.invoke($scope.node.pointer.domain, 'getEditUrl', [node]));
                }, function (ex) { });
            };

            $scope.back = function () {
                if ($rootScope.location.previous) {
                    $location.previous($rootScope.location.previous);
                }
                else {
                    $location.previous($fn.invoke($scope.node.domain, 'getBackUrl', [$scope.node]));
                }
            };

            $scope.discard = function () {
                fn.discard().catch(function (ex) {
                    logger.error(ex);
                });
            };
            
            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;

                    if (!success) {
                        $scope.scroll2error();
                    }
                    else {
                        fn.setLocation().catch(function (locEx) {
                            logger.error(locEx);
                        });
                    }
                }, function (ex) {
                    logger.error(ex);
                });
            };
            
            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().catch(function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('tmpl', function (newValue, prevValue) {
                fn.setSpy(200).catch(function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('node.entity', function (newValue) {
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

                    var defaults = {
                        treeNode: true,
                        localized: true,
                        parent: true,
                        seo: true,
                        meta: true,
                        permissions: true
                    };

                    var entity = {};
                    $.extend(true, entity, defaults);

                    var knownEntity = _.first(_.filter($jsnbt.entities, function (x) { return x.name === newValue; }));

                    if (knownEntity)
                        $.extend(true, entity, knownEntity);

                    $scope.entity = knownEntity;

                    fn.setViews().catch(function (ex) {
                        logger.error(ex);
                    });
                }
            });

            $scope.$watch('node.template', function () {
                fn.setTmpl().then(function () {
                    fn.setSpy(200).catch(function (spyEx) {
                        logger.error(spyEx);
                    });
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('node.parent', function () {
                if (!$scope.node)
                    return;

                fn.setSeo().catch(function (ex) {
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
            
            $scope.$watch('node.layout.inherits', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    if (newValue === true) {
                        fn.getHierarchyNodes().then(function (hierarchyNodes) {
                            fn.setSelectedLayout(hierarchyNodes).catch(function (setEx) {
                                logger.error(setEx);
                            });
                        }, function (ex) {
                            logger.error(ex);
                        });
                    }
                    else {
                        fn.setSelectedLayout().catch(function (setEx) {
                            logger.error(setEx);
                        });
                    }
                }
            });

            $scope.$watch('node.roles.inherits', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    if (newValue === true) {
                        fn.getHierarchyNodes().then(function (hierarchyNodes) {
                            fn.setSelectedRoles(hierarchyNodes).catch(function (setEx) {
                                logger.error(setEx);
                            });
                        }, function (ex) {
                            logger.error(ex);
                        });
                    }
                    else {
                        fn.setSelectedRoles().catch(function (setEx) {
                            logger.error(setEx);
                        });
                    }
                }
            });

            $scope.$watch('node.robots.inherits', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    if (newValue === true) {
                        fn.getHierarchyNodes().then(function (hierarchyNodes) {
                            fn.setSelectedRobots(hierarchyNodes).catch(function (setEx) {
                                logger.error(setEx);
                            });
                        }, function (ex) {
                            logger.error(ex);
                        });
                    }
                    else {
                        fn.setSelectedRobots().catch(function (setEx) {
                            logger.error(setEx);
                        });
                    }
                }
            });
            
            dpd.on(DATA_EVENTS.nodeUpdated, function (node) {
                // updated from another user??
            });
            
            dpd.on(DATA_EVENTS.nodeDeleted, function (node) {
                // throw 404 if is current not found
            });

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
                sender.stopPropagation();
                
                fn.save().then(function () {
                    $scope.published = false;
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });


            $timeout(function () {
                $q.all(fn.setLayouts(), fn.setRoles(), fn.setRobots(), fn.setModules(), fn.setLanguages(), fn.setLanguage(), fn.setTypes()).then(function () {
                    fn.set().then(function (setResponse) {
                        fn.getHierarchyNodes().then(function (hierarchyNodes) {
                            $q.all(fn.setSelectedLayout(hierarchyNodes), fn.setSelectedRoles(hierarchyNodes), fn.setSelectedRobots(hierarchyNodes)).then(function () {
                            }, function (set2Error) {
                                logger.error(set2Error);
                            });
                        }, function (getError) {
                            logger.error(getError);
                        });                        
                    }, function (setError) {
                        logger.error(setError);
                    });
                });
            }, 200);

        });
})();