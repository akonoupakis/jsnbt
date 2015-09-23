/* global angular:false */

(function () {
    "use strict";

    jsnbt.NodeFormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('NodeFormControllerBase');

        $scope.domain = $route.current.$$route.domain || 'core';
        $scope.entityName = $route.current.$$route.entity || 'page';

        $scope.node = undefined;
        $scope.nodes = [];
        $scope.entity = undefined;

        $scope.roles = [];
        $scope.robots = [];
        $scope.layouts = [];

        $scope.seoNames = [];

        $scope.siblingSeoNames = [];

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
            layout: '',
            ssl: false
        };
        $scope.draftValues = {
            roles: [],
            robots: [],
            layout: '',
            ssl: false
        };
        
        $scope.queue = {
            preload: [],
            load: [],
            set: [],
            patch: []
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

        $scope.enqueue = function (key, fn) {
            if (!$scope.queue[key])
                throw new Error('queue key not found: ' + key);

            $scope.queue[key].push(fn);
        }

        $scope.enqueue('load', function () {
            var deferred = $q.defer();

            if (!$scope.isNew()) {
                $scope.values.layout = $scope.node.layout.value || '';
                $scope.draftValues.layout = $scope.node.layout.value || '';
            }

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('load', function () {
            var deferred = $q.defer();

            if (!$scope.isNew()) {
                $scope.values.roles = $scope.node.roles.value || [];
                $scope.draftValues.roles = $scope.node.roles.value || [];
            }

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('load', function () {
            var deferred = $q.defer();

            if (!$scope.isNew()) {
                $scope.values.robots = $scope.node.robots.value || [];
                $scope.draftValues.robots = $scope.node.robots.value || [];
            }

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('load', function () {
            var deferred = $q.defer();

            if (!$scope.isNew()) {
                $scope.values.secure = $scope.node.secure.value || false;
                $scope.draftValues.secure = $scope.node.secure.value || false;
            }

            deferred.resolve();

            return deferred.promise;
        });

        $scope.preload = function () {
            var deferred = $q.defer();

            $q.all(_.map($scope.queue.preload, function (x) { return x(); })).then(function () {
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.load = function () {
            var deferred = $q.defer();

            var setActiveProperties = function (node) {
                _.each($scope.application.languages, function (lang) {
                    if (!node.active[lang.code])
                        node.active[lang.code] = false;
                });
            };

            if ($scope.isNew()) {
                if (_.str.startsWith($scope.id, 'new-')) {
                    var parentNodeId = $scope.id.substring(4);
                    $data.nodes.get(parentNodeId).then(function (parentResult) {
                        var entity = parentResult.entity;

                        if ($scope.entityName)
                            entity = $scope.entityName;

                        $scope.set($data.create('nodes', {
                            domain: parentResult.domain,
                            name: '',
                            entity: entity,
                            parent: parentNodeId,
                            hierarchy: parentResult.hierarchy
                        }));

                        $scope.setName('');

                        $scope.localized = $scope.application.localization.enabled && (entity.localized === undefined || entity.localized === true);

                        $scope.setValid(true);
                        $scope.setPublished(false);

                        $q.all(_.map($scope.queue.load, function (x) { return x(); })).then(function () {
                            setActiveProperties($scope.node);

                            deferred.resolve($scope.node);
                        }, function (loadFnError) {
                            deferred.reject(loadFnError);
                        });

                    }, function (error) {
                        deferred.reject(error);
                    });
                }
                else {
                    var entity = $scope.entityName;

                    $scope.set($data.create('nodes', {
                        domain: $scope.domain,
                        name: '',
                        entity: entity,
                        parent: '',
                    }));

                    $scope.setName('');

                    $scope.localized = $scope.application.localization.enabled && (entity.localized === undefined || entity.localized === true);

                    $scope.setValid(true);
                    $scope.setPublished(false);

                    $q.all(_.map($scope.queue.load, function (x) { return x(); })).then(function () {
                        setActiveProperties($scope.node);

                        deferred.resolve($scope.node);
                    }, function (loadFnError) {
                        deferred.reject(loadFnError);
                    });
                }
            }
            else {
                $data.nodes.get($scope.id).then(function (result) {
                    $scope.set(result);

                    $scope.setName(result.title[$scope.defaults.language]);
                    
                    var matchedEntity = $jsnbt.entities[result.entity] || {};
                    $scope.localized = $scope.application.localization.enabled && (matchedEntity.localized === undefined || matchedEntity.localized === true);

                    $scope.parentOptions.restricted = [$scope.id];

                    $scope.setValid(true);
                    $scope.setPublished(true);

                    $q.all(_.map($scope.queue.load, function (x) { return x(); })).then(function () {
                        setActiveProperties($scope.node);

                        deferred.resolve($scope.node);
                    }, function (loadFnError) {
                        deferred.reject(loadFnError);
                    });

                }, function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        };

        $scope.set = function (data) {
            $scope.node = data;
        };

        $scope.get = function () {
            return $scope.node;
        };

        $scope.setHierarchyNodes = function () {
            var deferred = $q.defer();

            var hierarchyNodeIds = _.filter($scope.node.hierarchy, function (x) { return x !== $scope.id; });
            if (hierarchyNodeIds.length > 0) {
                $data.nodes.get({ id: { $in: hierarchyNodeIds } }).then(function (nodes) {

                    var hierarchyNodes = [];

                    $($scope.node.hierarchy).each(function (i, item) {
                        var matchedNode = _.first(_.filter(nodes, function (x) { return x.id === item; }));
                        if (matchedNode) {
                            hierarchyNodes.push(matchedNode);
                        }
                    });

                    $scope.nodes = hierarchyNodes;
                    deferred.resolve(hierarchyNodes);

                }, function (error) {
                    deferred.reject(error);
                });
            }
            else {
                deferred.resolve([]);
            }

            return deferred.promise;
        };

        $scope.setSelectedLayout = function () {
            var deferred = $q.defer();

            if ($scope.node.layout.inherits) {
                $scope.draftValues.layout = $scope.values.layout;

                var layout = '';

                $($scope.node.hierarchy).each(function (i, item) {
                    var matchedNode = _.first(_.filter($scope.nodes, function (x) { return x.id === item; }));
                    if (matchedNode) {
                        if (!matchedNode.layout.inherits) {
                            layout = matchedNode.layout.value;
                        }
                    }
                    else {
                        return false;
                    }
                });

                $scope.values.layout = layout;
                deferred.resolve(layout);
            }
            else {
                $scope.values.layout = $scope.draftValues.layout;
                deferred.resolve($scope.values.layout);
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

        $scope.setSpy = function (time) {
            var deferred = $q.defer();

            ScrollSpyService.get(time || 0).then(function (response) {
                $scope.nav = response;
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        $scope.setSeo = function () {
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

                                    $($scope.application.localization.enabled ? $scope.application.languages : ['en']).each(function (l, lang) {

                                        if (result.seo[lang.code])
                                            newSeoNode[lang.code] = result.seo[lang.code] || 'undefined';
                                        else
                                            newSeoNode[lang.code] = 'undefined'
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

        $scope.setLocation = function () {
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
                                
                                breadcrumb.push({
                                    name: resultNode.title[$scope.defaults.language],
                                    url: currentUrl + '/' + item,
                                    active: i === (hierarchy.length - 1)
                                });
                            }
                        });

                        if ($scope.isNew()) {
                            breadcrumb.push({
                                name: 'new',
                                url: '',
                                active: true
                            });
                        }

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
                    hierarchy = [];

                    if ($scope.node.id)
                        hierarchy.push($scope.node.id);

                    setLocInternal(hierarchy);
                }
            }
            else {
                deferred.resolve(breadcrumb);
            }

            return deferred.promise;
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
            $data.nodes.get($scope.node.pointer.nodeId).then(function (targetNode) {
                $location.next($jsnbt.entities[targetNode.entity].getEditUrl(targetNode, '/content/nodes'));
            }, function (ex) {
                throw ex;
            });
        };

        $scope.back = function () {
            $scope.current.breadcrumb.pop();
            var lastItem = _.last($scope.current.breadcrumb);
            if (lastItem) {
                $location.previous(lastItem.url);
            }
            else {
                throw new Error('not implemented');
            }
        };

        $scope.discard = function () {

            $scope.load().then(function (response) {

            }, function (error) {
                logger.error(ex);
            });

        };

        $scope.validate = function () {
            var deferred = $q.defer();

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
                        if ($scope.localized) {

                            var checkLanguage = function (lang, next) {
                                $scope.language = lang.code;

                                $timeout(function () {

                                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

                                    $timeout(function () {

                                    checkExtras(lang.code).then(function (internalValidationResults) {
                                        if (!$scope.valid)
                                            deferred.resolve(false);
                                        else
                                            next();
                                    }, function (internalValidationError) {
                                        throw internalValidationError;
                                    });

                                    }, 50);

                                }, 50);
                            };

                            var currentLanguage = $scope.language;
                            var restLanguages = _.filter($scope.languages, function (x) { return x.active && x.code !== currentLanguage; }); //  && $scope.node.active[x.code]
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
        };
        
        $scope.enqueue('patch', function (node) {
            var deferred = $q.defer();

            if (!node.roles)
                node.roles = {};

            node.roles.value = !node.roles.inherits ? $scope.values.roles : [];

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('patch', function (node) {
            var deferred = $q.defer();

            if (!node.robots)
                node.robots = {};

            node.robots.value = !node.robots.inherits ? $scope.values.robots : [];

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('patch', function (node) {
            var deferred = $q.defer();

            if (!node.layout)
                node.layout = {};

            node.layout.value = !node.layout.inherits ? $scope.values.layout : '';

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('patch', function (node) {
            var deferred = $q.defer();

            if (!node.secure)
                node.secure = {};

            node.secure.value = !node.secure.inherits ? $scope.values.secure : false;

            deferred.resolve();

            return deferred.promise;
        });

        $scope.publish = function () {

            var publish = function () {
                var deferred = $q.defer();
                
                $scope.validate().then(function (validationResults) {
                    if (!validationResults) {
                        deferred.resolve(false);
                    }
                    else {
                        var publishNode = {};
                        $.extend(true, publishNode, $scope.node);

                        $q.all(_.map($scope.queue.patch, function (x) { return x(publishNode); })).then(function () {
                         
                            if ($scope.isNew()) {
                                $data.nodes.post(publishNode).then(function (result) {
                                    $scope.node = result;
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.nodes.put($scope.id, publishNode).then(function (result) {
                                    $scope.name = result.title[$scope.defaults.language];
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }

                        }, function (loadFnError) {
                            deferred.reject(loadFnError);
                        });
                    }
                });

                return deferred.promise;
            };

            publish().then(function (success) {
                $scope.published = success;

                if (!success) {
                    $scope.scroll2error();
                }
                else {
                    if ($scope.isNew()) {
                        $location.goto($jsnbt.entities[$scope.node.entity].getEditUrl($scope.node));
                    }
                    else {
                        $scope.setLocation().catch(function (locEx) {
                            logger.error(locEx);
                        });
                    }
                }
            }, function (ex) {
                logger.error(ex);
            });
        };

        $scope.$watch('tmplInject', function (newValue, prevValue) {
            $scope.setSpy(200).catch(function (ex) {
                logger.error(ex);
            });
        });

        $scope.$watch('node.entity', function (newValue) {
            if ($scope.node) {

                $scope.setParentEntities().then(function () {
                    $scope.setTmpl().then(function () {
                        $scope.setSpy(200);
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
                    permissions: true,
                    ssl: true
                };

                var entity = {};
                $.extend(true, entity, defaults);

                var knownEntity = $jsnbt.entities[newValue];

                if (knownEntity)
                    $.extend(true, entity, knownEntity);

                $scope.entity = knownEntity;
            }
        });

        $scope.$watch('node.template', function () {
            $scope.setTmpl().then(function () {
                $scope.setSpy(200).catch(function (spyEx) {
                    logger.error(spyEx);
                });
            }, function (ex) {
                logger.error(ex);
            });
        });

        $scope.$watch('node.parent', function () {
            if (!$scope.node)
                return;

            $scope.setSeo().catch(function (ex) {
                logger.error(ex);
            });
        });
        
        $scope.$watch('node.pointer.domain', function (newValue, prevValue) {
            if (newValue !== undefined && prevValue !== undefined) {
                $scope.node.pointer.nodeId = '';

                $scope.setPublished(false);
            }
        });

        $scope.$watch('node.layout.inherits', function (newValue, prevValue) {
            if (newValue !== undefined && prevValue !== undefined) {
                if (newValue === true) {
                    $scope.setHierarchyNodes().then(function () {
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

        $scope.$watch('node.secure.inherits', function (newValue, prevValue) {
            if (newValue !== undefined && prevValue !== undefined) {
                if (newValue === true) {
                    $scope.setHierarchyNodes().then(function () {
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

        $scope.$watch('node.roles.inherits', function (newValue, prevValue) {
            if (newValue !== undefined && prevValue !== undefined) {
                if (newValue === true) {
                    $scope.setHierarchyNodes().then(function () {
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

        $scope.$watch('node.robots.inherits', function (newValue, prevValue) {
            if (newValue !== undefined && prevValue !== undefined) {
                if (newValue === true) {
                    $scope.setHierarchyNodes().then(function () {
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

        jsnbt.db.on(DATA_EVENTS.nodeUpdated, function (node) {
            // updated from another user??
        });

        jsnbt.db.on(DATA_EVENTS.nodeDeleted, function (node) {
            // throw 404 if is current not found
        });
        
        $scope.enqueue('set', $scope.setSelectedSSL);
        $scope.enqueue('set', $scope.setSelectedLayout);
        $scope.enqueue('set', $scope.setSelectedRoles);
        $scope.enqueue('set', $scope.setSelectedRobots);

        $scope.init = function () {
            var deferred = $q.defer();

            $timeout(function () {
                $q.all($scope.setLayouts(), $scope.setRoles(), $scope.setRobots(), $scope.setModules(), $scope.setLanguages(), $scope.setLanguage(), $scope.setEntities(), $scope.setRoutes(), $scope.setViews()).then(function () {
                    $scope.preload().then(function () {
                        $scope.load().then(function (setResponse) {
                            $scope.setHierarchyNodes().then(function () {
                                $q.all(_.map($scope.queue.set, function (x) { return x(); })).then(function () {
                                    deferred.resolve();
                                }, function (set2Error) {
                                    logger.error(set2Error);
                                    deferred.reject(set2Error);
                                });
                            }, function (getError) {
                                logger.error(getError);
                                deferred.reject(getError);
                            });
                        }, function (setError) {
                            logger.error(setError);
                            deferred.reject(setError);
                        });
                    }, function (setError) {
                        logger.error(setError);
                        deferred.reject(setError);
                    });
                });
            }, 200);

            return deferred.promise;
        };

    };
    jsnbt.NodeFormControllerBase.prototype = Object.create(jsnbt.FormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodeFormControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.NodeFormControllerBase]);
})();