/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.NodeFormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                controllers.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

                var logger = $logger.create('NodeFormControllerBase');

                $scope.offset = $scope.prefix ? _.str.trim($scope.prefix || '', '/').split('/').length : 0;

                $scope.node = undefined;
                $scope.parent = undefined;
                $scope.nodes = [];
                $scope.entity = $scope.entity || 'page';

                $scope.entity = $jsnbt.entities[$scope.entity];

                $scope.roles = [];
                $scope.robots = [];
                $scope.layouts = [];

                $scope.seoNames = [];

                $scope.siblings = [];

                $scope.entities = [];
                $scope.routes = [];
                $scope.languages = [];
                $scope.templates = {};
                $scope.modules = [];

                $scope.localized = false;
                $scope.language = undefined;

                $scope.values = {
                    roles: [],
                    robots: [],
                    layouts: [],
                    ssl: false
                };
                $scope.draftValues = {
                    roles: [],
                    robots: [],
                    layouts: [],
                    ssl: false
                };

                $scope.validation = {
                    seo: true
                };

                $scope.form = null;

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




                $scope.setHierarchyNodes = function (node) {
                    var deferred = $q.defer();

                    if (node) {
                        var hierarchyNodeIds = _.filter(node.hierarchy, function (x) { return x !== $scope.id; });
                        if (hierarchyNodeIds.length > 0) {
                            $data.nodes.get({ id: { $in: hierarchyNodeIds } }).then(function (nodes) {
                                var hierarchyNodes = [];

                                $(node.hierarchy).each(function (i, item) {
                                    var matchedNode = _.first(_.filter(nodes, function (x) { return x.id === item; }));
                                    if (matchedNode) {
                                        hierarchyNodes.push(matchedNode);
                                    }
                                });

                                $scope.nodes = hierarchyNodes;
                                deferred.resolve(hierarchyNodes);

                            }).catch(function (error) {
                                deferred.reject(error);
                            });
                        }
                        else {
                            deferred.resolve([]);
                        }
                    }
                    else {
                        deferred.resolve([]);
                    }

                    return deferred.promise;
                };

                $scope.setSelectedLayout = function () {
                    var deferred = $q.defer();

                    if ($scope.node.layouts.inherits) {
                        $scope.draftValues.layouts = $scope.values.layouts;

                        var layouts = [];

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter($scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.layouts.inherits) {
                                    layouts = matchedNode.layouts.value;
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        $scope.values.layouts = layouts;
                        deferred.resolve(layouts);
                    }
                    else {
                        var layouts = $scope.draftValues.layouts;
                        $scope.values.layouts = layouts;
                        deferred.resolve($scope.values.layouts);
                    }

                    return deferred.promise;
                };

                $scope.setSelectedSSL = function () {
                    var deferred = $q.defer();

                    if ($scope.node.secure.inherits) {
                        $scope.draftValues.secure = $scope.values.secure;

                        var ssl = false;

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter($scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.secure.inherits) {
                                    ssl = matchedNode.secure.value;
                                }
                            }
                            else {
                                return false;
                            }
                        });
                        $scope.values.secure = ssl;
                        deferred.resolve(ssl);
                    }
                    else {
                        $scope.values.secure = $scope.draftValues.secure;
                        deferred.resolve($scope.values.secure);
                    }

                    return deferred.promise;
                };

                $scope.setSelectedRoles = function () {
                    var deferred = $q.defer();

                    if ($scope.node.roles.inherits) {
                        $scope.draftValues.roles = $scope.values.roles.slice(0);

                        var roles = [];

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter($scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.roles.inherits) {
                                    roles = matchedNode.roles.value.slice(0);
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        $scope.values.roles = roles;
                        deferred.resolve(roles);
                    }
                    else {
                        var roles = $scope.draftValues.roles.slice(0);
                        $scope.values.roles = roles;
                        deferred.resolve(roles);
                    }

                    return deferred.promise;
                };

                $scope.setSelectedRobots = function () {
                    var deferred = $q.defer();

                    if ($scope.node.robots.inherits) {
                        $scope.draftValues.robots = $scope.values.robots.slice(0);

                        var robots = [];

                        $($scope.node.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter($scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.robots.inherits) {
                                    robots = matchedNode.robots.value.slice(0);
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        $scope.values.robots = robots;
                        deferred.resolve(robots);
                    }
                    else {
                        var robots = $scope.draftValues.robots.slice(0);
                        $scope.values.robots = robots;
                        deferred.resolve(robots);
                    }

                    return deferred.promise;
                };

                $scope.setParentEntities = function () {
                    var deferred = $q.defer();

                    var parentEntities = [];

                    for (var entityName in $jsnbt.entities) {
                        var entity = $jsnbt.entities[entityName];
                        if (_.isArray(entity.allowed)) {
                            if (entity.allowed.indexOf($scope.node.entity) !== -1) {
                                parentEntities.push(entity.name);
                            }
                        }
                    }

                    $scope.parentOptions.entities = parentEntities;

                    deferred.resolve(parentEntities);

                    return deferred.promise;
                };

                $scope.setTmpl = function () {
                    var deferred = $q.defer();

                    if ($scope.node && $scope.node.entity !== 'pointer') {
                        var jtmpl = $jsnbt.templates[$scope.node.template];
                        if (jtmpl) {
                            $scope.form = jtmpl.form;
                        }
                        else {
                            $scope.form = undefined;
                        }
                    }
                    else {
                        $scope.form = undefined;
                    }

                    deferred.resolve();

                    return deferred.promise;
                };

                $scope.setSeo = function () {
                    var deferred = $q.defer();

                    if ($scope.node && $scope.node.parent && $scope.node.parent !== '') {
                        $data.nodes.get({ id: $scope.node.parent }).then(function (parentResult) {
                            var nodeIds = parentResult.hierarchy;

                            if (nodeIds.length > 0) {

                                var languageCodes = $scope.application.localization.enabled ? _.pluck($scope.application.languages, 'code') : [$scope.defaults.language];

                                $data.nodes.get({ id: { $in: nodeIds } }).then(function (results) {
                                    var newSeoNodes = [];
                                    _.each(nodeIds, function (nodeId) {
                                        var result = _.find(results, function (x) { return x.id === nodeId; });
                                        if (result) {
                                            var newSeoNode = {};
                                            _.each(languageCodes, function (lang) {
                                                if (result.seo[lang])
                                                    newSeoNode[lang] = result.seo[lang] || 'undefined';
                                                else
                                                    newSeoNode[lang] = 'undefined'
                                            });

                                            newSeoNodes.push(newSeoNode);
                                        }
                                        else {
                                            newSeoNodes.push({});
                                        }
                                    });

                                    $scope.seoNames = newSeoNodes;
                                    deferred.resolve(newSeoNodes);

                                }).catch(function (error) {
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
                };

                $scope.setLayouts = function () {
                    var deferred = $q.defer();

                    var layouts = [];
                    for (var layoutName in $jsnbt.layouts) {
                        var layout = $jsnbt.layouts[layoutName];

                        layouts.push({
                            id: layout.id,
                            name: layout.name
                        });
                    };

                    $scope.layouts = layouts;

                    deferred.resolve(layouts);

                    return deferred.promise;
                };

                $scope.setRoles = function () {
                    var deferred = $q.defer();

                    var allRoles = [];

                    for (var roleName in $jsnbt.roles) {
                        var role = $jsnbt.roles[roleName];

                        if (!AuthService.isInRole({ roles: [role.name] }, 'admin')) {
                            var newRole = {};
                            $.extend(true, newRole, role);
                            newRole.value = newRole.name;
                            newRole.disabled = !AuthService.isInRole($scope.current.user, role.name);
                            newRole.description = role.inherits.length > 0 ? 'inherits from ' + role.inherits.join(', ') : '';
                            allRoles.push(newRole);
                        }
                    };

                    $scope.roles = allRoles;

                    deferred.resolve(allRoles);

                    return deferred.promise;
                };

                $scope.setRobots = function () {
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
                };

                $scope.setModules = function () {
                    var deferred = $q.defer();

                    var modules = [];
                    for (var moduleName in $jsnbt.modules) {
                        var module = $jsnbt.modules[moduleName];
                        if (module.pointed) {
                            modules.push({
                                name: module.name,
                                domain: module.domain
                            });
                        }
                    }
                    $scope.modules = modules;

                    deferred.resolve(modules);

                    return deferred.promise;
                };

                $scope.setLanguages = function () {
                    var deferred = $q.defer();

                    var results = $scope.application.languages;

                    $scope.languages = results;

                    deferred.resolve(results);

                    return deferred.promise;
                };

                $scope.setLanguage = function () {
                    var deferred = $q.defer();

                    var result = $scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code;

                    $scope.language = result;

                    deferred.resolve(result);

                    return deferred.promise;
                };

                $scope.setEntities = function () {
                    var deferred = $q.defer();

                    var types = [];

                    if ($scope.domain === 'core') {
                        types.push({ value: 'page', name: 'page' });

                        var pointerModules = false;
                        for (var moduleName in $jsnbt.modules) {
                            var module = $jsnbt.modules[moduleName];
                            if (module.pointed) {
                                pointerModules = true;
                            }
                        }

                        if (pointerModules)
                            types.push({ value: 'pointer', name: 'pointer' });

                        if (_.keys($jsnbt.routes).length > 0)
                            types.push({ value: 'router', name: 'router' });
                    }
                    else {
                        for (var entityName in $jsnbt.entities) {
                            if ($jsnbt.entities[entityName].domain === $scope.domain) {
                                types.push({ value: entityName, name: $jsnbt.entities[entityName].name });
                            }
                        }
                    }

                    $scope.entities = types;

                    deferred.resolve(types);

                    return deferred.promise;
                };

                $scope.setRoutes = function () {
                    var deferred = $q.defer();

                    var routes = [];
                    for (var routeName in $jsnbt.routes) {
                        routes.push($jsnbt.routes[routeName]);
                    }

                    $scope.routes = routes;

                    deferred.resolve(routes);

                    return deferred.promise;
                };

                $scope.setViews = function () {
                    var deferred = $q.defer();

                    var templates = {};

                    for (var entityName in $jsnbt.entities) {
                        templates[entityName] = [];

                        for (var templateName in $jsnbt.templates) {
                            var template = $jsnbt.templates[templateName];

                            var tmpl = {};
                            $.extend(true, tmpl, template);

                            var include = false;

                            if (tmpl.restricted) {
                                if (tmpl.restricted.indexOf(entityName) !== -1) {
                                    templates[entityName].push(tmpl);
                                }
                            }
                            else {
                                templates[entityName].push(tmpl);
                            }
                        }
                    }

                    $scope.templates = templates;

                    deferred.resolve();

                    return deferred.promise;
                };

                $scope.validateSeo = function (value) {
                    var valid = true;

                    if ($scope.entity.properties.seo) {
                        var siblingSeoNames = _.pluck(_.pluck(_.filter($scope.siblings, function (x) { return x.seo && x.seo[$scope.language]; }), 'seo'), $scope.language);

                        valid = siblingSeoNames.indexOf(value) === -1;
                        $scope.validation.seo = valid;
                    }

                    return valid;
                };

                $scope.editPointee = function () {
                    $data.nodes.get($scope.node.pointer.nodeId).then(function (targetNode) {
                        $location.next($jsnbt.entities[targetNode.entity].getEditUrl(targetNode, '/content/nodes'));
                    }, function (ex) {
                        throw ex;
                    });
                };


                $scope.enqueue('preloading', function () {
                    var deferred = $q.defer();

                    $q.all($scope.setLayouts(), $scope.setRoles(), $scope.setRobots(), $scope.setModules(), $scope.setLanguages(), $scope.setLanguage(), $scope.setEntities(), $scope.setRoutes(), $scope.setViews()).then(function (results) {
                        deferred.resolve(results);
                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                });

                $scope.enqueue('preloading', function () {
                    var deferred = $q.defer();

                    if ($scope.isNew()) {
                        if (_.str.startsWith($scope.id, 'new-')) {
                            var parentNodeId = $scope.id.substring(4);
                            $data.nodes.get(parentNodeId).then(function (parentResult) {
                                $scope.parent = parentResult;
                                deferred.resolve(parentResult);
                            }).catch(function (error) {
                                deferred.reject(error);
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                });


                $scope.load = function () {
                    var deferred = $q.defer();

                    if ($scope.isNew()) {
                        deferred.resolve();
                    }
                    else {
                        $data.nodes.get($scope.id).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };


                $scope.enqueue('loaded', function (node) {
                    var deferred = $q.defer();

                    if (!$scope.isNew()) {
                        if (node && node.parent && node.parent !== '') {
                            $data.nodes.get(node.parent).then(function (parentResult) {
                                $scope.parent = parentResult;
                                deferred.resolve(parentResult);
                            }).catch(function (error) {
                                deferred.reject(error);
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                });


                $scope.set = function (data) {
                    var deferred = $q.defer();

                    if ($scope.isNew()) {
                        $scope.setTitle('');

                        var entity = undefined;

                        if ($scope.entity)
                            entity = $scope.entity.name;
                        else
                            if ($scope.parent)
                                entity = $scope.parent.entity;

                        $scope.node = $data.create('nodes', {
                            domain: $scope.domain,
                            entity: entity,
                            parent: $scope.parent ? $scope.parent.id : '',
                            hierarchy: $scope.parent ? $scope.parent.hierarchy : []
                        });

                        $scope.localized = $scope.application.localization.enabled && (entity.localized === undefined || entity.localized === true);

                        $scope.setValid(true);
                        $scope.setPublished(false);

                        deferred.resolve($scope.node);
                    }
                    else {
                        if (data) {
                            $scope.setTitle(data.title[$scope.defaults.language]);
                            $scope.node = data;

                            var matchedEntity = $jsnbt.entities[data.entity] || {};
                            $scope.localized = $scope.application.localization.enabled && (matchedEntity.localized === undefined || matchedEntity.localized === true);

                            $scope.entity = matchedEntity;

                            $scope.parentOptions.restricted = [data.id];

                            $scope.setValid(true);
                            $scope.setPublished(true);

                            deferred.resolve($scope.node);
                        }
                        else {
                            deferred.reject(new Error('data is not defined for setting into scope'));
                        }
                    }

                    return deferred.promise;
                };


                $scope.enqueue('setting', function (node) {
                    var deferred = $q.defer();

                    $scope.setHierarchyNodes(node).then(function () {
                        deferred.resolve();
                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                });

                $scope.enqueue('set', function (node) {
                    if (node && _.isObject(node.active)) {
                        _.each($scope.application.languages, function (lang) {
                            if (node.active[lang.code] === undefined)
                                node.active[lang.code] = false;
                        });
                    }
                });

                $scope.enqueue('set', function (node) {
                    var deferred = $q.defer();

                    $scope.setParentEntities().then(function () {
                        $scope.setTmpl().then(function () {
                            deferred.resolve();
                        }).catch(function (tmplEx) {
                            deferred.reject(tmplEx);
                        });
                    }, function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                });

                $scope.enqueue('set', function (node) {
                    return $scope.setSelectedSSL(node);
                });

                $scope.enqueue('set', function (node) {
                    return $scope.setSelectedLayout(node);
                });

                $scope.enqueue('set', function (node) {
                    return $scope.setSelectedRoles(node);
                });

                $scope.enqueue('set', function (node) {
                    return $scope.setSelectedRobots(node);
                });

                $scope.enqueue('set', function (node) {
                    var deferred = $q.defer();

                    if (!$scope.isNew()) {
                        $scope.values.layouts = node.layouts.value || [];
                        $scope.draftValues.layouts = node.layouts.value || [];
                    }

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('set', function (node) {
                    var deferred = $q.defer();

                    if (!$scope.isNew()) {
                        $scope.values.roles = node.roles.value || [];
                        $scope.draftValues.roles = node.roles.value || [];
                    }

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('set', function (node) {
                    var deferred = $q.defer();

                    if (!$scope.isNew()) {
                        $scope.values.robots = node.robots.value || [];
                        $scope.draftValues.robots = node.robots.value || [];
                    }

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('set', function (node) {
                    var deferred = $q.defer();

                    if (!$scope.isNew()) {
                        $scope.values.secure = node.secure.value || false;
                        $scope.draftValues.secure = node.secure.value || false;
                    }

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('set', function (node) {
                    var deferred = $q.defer();

                    if (node.parent && node.parent !== '') {
                        $scope.setSeo().then(function (response) {
                            deferred.resolve();
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                });


                $scope.get = function () {
                    return $scope.node;
                };


                var validateFn = $scope.validate;
                $scope.validate = function () {
                    var deferred = $q.defer();

                    var checkExtras = function (lang) {
                        var deferredInternal = $q.defer();

                        if ($scope.node.active[lang]) {
                            if ($scope.entity.properties.seo) {
                                $data.nodes.get({ parent: $scope.node.parent, domain: $scope.node.domain, id: { $nin: [$scope.node.id] } }).then(function (siblingsResponse) {
                                    $scope.siblings = siblingsResponse;

                                    var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingsResponse, function (x) { return x.seo[lang]; }), 'seo'), lang);

                                    $scope.validation.seo = $scope.node.seo[lang] && siblingSeoNames.indexOf($scope.node.seo[lang]) === -1;

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

                    $scope.setValid(true);
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

                                validateFn().then(function (valResults) {
                                    deferred.resolve(valResults);
                                }).catch(function (valError) {
                                    deferred.reject(valError);
                                });

                            }

                        }, function (validationError) {
                            deferred.reject(validationError);
                        });

                    }

                    return deferred.promise;
                };


                $scope.enqueue('publishing', function (node) {
                    var deferred = $q.defer();

                    if (!node.roles)
                        node.roles = {};

                    node.roles.value = !node.roles.inherits ? $scope.values.roles : [];

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('publishing', function (node) {
                    var deferred = $q.defer();

                    if (!node.robots)
                        node.robots = {};

                    node.robots.value = !node.robots.inherits ? $scope.values.robots : [];

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('publishing', function (node) {
                    var deferred = $q.defer();

                    if (!node.layouts)
                        node.layouts = {};

                    node.layouts.value = !node.layouts.inherits ? $scope.values.layouts : [];

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('publishing', function (node) {
                    var deferred = $q.defer();

                    if (!node.secure)
                        node.secure = {};

                    node.secure.value = !node.secure.inherits ? $scope.values.secure : false;

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('tmpls', function (newValue, prevValue) {
                        if (!_.isEqual(newValue && prevValue)) {
                            $scope.setSpy(200);
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.entity', function (newValue, prevValue) {
                        if (newValue && newValue !== prevValue) {
                            $scope.setParentEntities().then(function () {
                                $scope.setTmpl().then(function () {
                                    $scope.setSpy(200);
                                }, function (tmplEx) {
                                    logger.error(tmplEx);
                                });
                            }, function (ex) {
                                logger.error(ex);
                            });

                            var entity = {};
                            $.extend(true, entity);

                            var knownEntity = $jsnbt.entities[newValue];

                            if (knownEntity)
                                $.extend(true, entity, knownEntity);

                            $scope.entity = knownEntity;
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.template', function (newValue, prevValue) {
                        if (newValue !== prevValue) {
                            $scope.setTmpl().then(function () {
                                $scope.setSpy(200);
                            }, function (ex) {
                                logger.error(ex);
                            });
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.parent', function (newValue, prevValue) {
                        if (newValue && newValue !== prevValue) {
                            if (newValue !== '') {
                                var existing = _.find($scope.nodes, function (x) {
                                    return x.id === newValue;
                                });

                                if (existing) {
                                    $scope.parent = existing;

                                    $scope.setSeo().catch(function (ex) {
                                        logger.error(ex);
                                    });
                                }
                                else {
                                    $data.nodes.get(newValue).then(function (response) {
                                        if (response)
                                            $scope.nodes.push(response);

                                        $scope.parent = response;

                                        $scope.setSeo().catch(function (ex) {
                                            logger.error(ex);
                                        });

                                    }).catch(function (error) {
                                        $scope.parent = undefined;
                                        logger.error(error);
                                    });
                                }
                            }
                            else {
                                $scope.parent = undefined;

                                $scope.setSeo().catch(function (ex) {
                                    logger.error(ex);
                                });
                            }
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.pointer.domain', function (newValue, prevValue) {
                        if (newValue !== undefined && prevValue !== undefined && newValue !== prevValue) {
                            $scope.node.pointer.nodeId = '';
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.layouts.inherits', function (newValue, prevValue) {
                        if (newValue !== undefined && prevValue !== undefined) {
                            if (newValue === true) {
                                $scope.setHierarchyNodes($scope.node).then(function () {
                                    $scope.setSelectedLayout().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }, function (ex) {
                                    logger.error(ex);
                                });
                            }
                            else {
                                $scope.setSelectedLayout().catch(function (setEx) {
                                    logger.error(setEx);
                                });
                            }
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.secure.inherits', function (newValue, prevValue) {
                        if (newValue !== undefined && prevValue !== undefined) {
                            if (newValue === true) {
                                $scope.setHierarchyNodes($scope.node).then(function () {
                                    $scope.setSelectedSSL().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }, function (ex) {
                                    logger.error(ex);
                                });
                            }
                            else {
                                $scope.setSelectedSSL().catch(function (setEx) {
                                    logger.error(setEx);
                                });
                            }
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.roles.inherits', function (newValue, prevValue) {
                        if (newValue !== undefined && prevValue !== undefined) {
                            if (newValue === true) {
                                $scope.setHierarchyNodes($scope.node).then(function () {
                                    $scope.setSelectedRoles().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }, function (ex) {
                                    logger.error(ex);
                                });
                            }
                            else {
                                $scope.setSelectedRoles().catch(function (setEx) {
                                    logger.error(setEx);
                                });
                            }
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('node.robots.inherits', function (newValue, prevValue) {
                        if (newValue !== undefined && prevValue !== undefined) {
                            if (newValue === true) {
                                $scope.setHierarchyNodes($scope.node).then(function () {
                                    $scope.setSelectedRobots().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }, function (ex) {
                                    logger.error(ex);
                                });
                            }
                            else {
                                $scope.setSelectedRobots().catch(function (setEx) {
                                    logger.error(setEx);
                                });
                            }
                        }
                    });

                    deferred.resolve();

                    return deferred.promise;
                });


                jsnbt.db.on(DATA_EVENTS.nodeUpdated, function (node) {
                    // updated from another user??
                });

                jsnbt.db.on(DATA_EVENTS.nodeDeleted, function (node) {
                    // throw 404 if is current not found
                });


                $scope.push = function (data) {
                    var deferred = $q.defer();

                    if ($scope.isNew()) {
                        $data.nodes.post(data).then(function (result) {
                            $scope.node = result;
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        $data.nodes.put($scope.id, data).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

            };
            controllers.NodeFormControllerBase.prototype = Object.create(controllers.FormControllerBase.prototype);

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();