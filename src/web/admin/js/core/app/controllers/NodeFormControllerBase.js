/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.NodeFormControllerBase = (function (NodeFormControllerBase) {

                NodeFormControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    var logger = $logger.create('NodeFormControllerBase');

                    $scope.localization = true;

                    $scope.offset = $scope.prefix ? _.str.trim($scope.prefix || '', '/').split('/').length : 0;

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

                    $scope.validation.seo = true;

                    $scope.form = null;

                    $scope.parentOptions = {
                        restricted: [],
                        entities: []
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
                        $data.nodes.get($scope.model.pointer.nodeId).then(function (targetNode) {
                            $scope.route.next($jsnbt.entities[targetNode.entity].getEditUrl(targetNode, '/content/nodes'));
                        }, function (ex) {
                            throw ex;
                        });
                    };


                    this.enqueue('preloading', '', function () {
                        var deferred = $q.defer();

                        $q.all(self.setLayouts(), self.setRoles(), self.setRobots(), self.setModules(), self.setLanguages(), self.setLanguage(), self.setEntities(), self.setRoutes(), self.setViews()).then(function (results) {
                            deferred.resolve(results);
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });

                        return deferred.promise;
                    });

                    this.enqueue('preloading', '', function () {
                        var deferred = $q.defer();

                        if (self.isNew()) {
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


                    this.enqueue('loaded', '', function (node) {
                        var deferred = $q.defer();

                        if (!self.isNew()) {
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


                    this.enqueue('setting', '', function (node) {
                        var deferred = $q.defer();

                        self.setHierarchyNodes(node).then(function () {
                            deferred.resolve();
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });

                        return deferred.promise;
                    });


                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        if (node && _.isObject(node.active)) {
                            _.each($scope.application.languages, function (lang) {
                                if (node.active[lang.code] === undefined)
                                    node.active[lang.code] = false;
                            });
                        }

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        self.setTemplate().then(function () {
                            deferred.resolve();
                        }).catch(function (tmplEx) {
                            deferred.reject(tmplEx);
                        });

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        self.setParentEntities().then(function () {
                            self.setTemplateForm().then(function () {
                                deferred.resolve();
                            }).catch(function (tmplEx) {
                                deferred.reject(tmplEx);
                            });
                        }, function (ex) {
                            deferred.reject(ex);
                        });

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        return self.setSelectedSSL(node);
                    });

                    this.enqueue('set', '', function (node) {
                        return self.setSelectedLayout(node);
                    });

                    this.enqueue('set', '', function (node) {
                        return self.setSelectedRoles(node);
                    });

                    this.enqueue('set', '', function (node) {
                        return self.setSelectedRobots(node);
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        if (!self.isNew()) {
                            $scope.values.layouts = node.layouts ? node.layouts.value : [];
                            $scope.draftValues.layouts = node.layouts ? node.layouts.value : [];
                        }

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        if (!self.isNew()) {
                            $scope.values.roles = node.roles ? node.roles.value : [];
                            $scope.draftValues.roles = node.roles ? node.roles.value : [];
                        }

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        if (!self.isNew()) {
                            $scope.values.robots = node.robots ? node.robots.value : [];
                            $scope.draftValues.robots = node.robots ? node.robots.value : [];
                        }

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        if (!self.isNew()) {
                            $scope.values.secure = node.secure ? node.secure.value : false;
                            $scope.draftValues.secure = node.secure ? node.secure.value : false;
                        }

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('set', '', function (node) {
                        var deferred = $q.defer();

                        if (node.parent && node.parent !== '') {
                            self.setSeo().then(function (response) {
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
             

                    this.enqueue('publishing', '', function (node) {
                        var deferred = $q.defer();

                        if (!node.roles)
                            node.roles = {};

                        node.roles.value = !node.roles.inherits ? $scope.values.roles : [];

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('publishing', '', function (node) {
                        var deferred = $q.defer();

                        if (!node.robots)
                            node.robots = {};

                        node.robots.value = !node.robots.inherits ? $scope.values.robots : [];

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('publishing', '', function (node) {
                        var deferred = $q.defer();

                        if (!node.layouts)
                            node.layouts = {};

                        node.layouts.value = !node.layouts.inherits ? $scope.values.layouts : [];

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('publishing', '', function (node) {
                        var deferred = $q.defer();

                        if (!node.secure)
                            node.secure = {};

                        node.secure.value = !node.secure.inherits ? $scope.values.secure : false;

                        deferred.resolve();

                        return deferred.promise;
                    });


                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.entity', function (newValue, prevValue) {
                            if (newValue && newValue !== prevValue) {
                                self.setParentEntities().then(function () {
                                    self.setTemplateForm().then(function () {
                                        self.setSpy(200);
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

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.template', function (newValue, prevValue) {
                            if (newValue !== prevValue) {
                                self.setTemplateForm().then(function () {
                                    self.setSpy(200);
                                }, function (ex) {
                                    logger.error(ex);
                                });
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.parent', function (newValue, prevValue) {
                            if (newValue && newValue !== prevValue) {
                                if (newValue !== '') {
                                    var existing = _.find($scope.nodes, function (x) {
                                        return x.id === newValue;
                                    });

                                    if (existing) {
                                        $scope.parent = existing;

                                        self.setSeo().catch(function (ex) {
                                            logger.error(ex);
                                        });
                                    }
                                    else {
                                        $data.nodes.get(newValue).then(function (response) {
                                            if (response)
                                                $scope.nodes.push(response);

                                            $scope.parent = response;

                                            self.setSeo().catch(function (ex) {
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

                                    self.setSeo().catch(function (ex) {
                                        logger.error(ex);
                                    });
                                }
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.pointer.domain', function (newValue, prevValue) {
                            if (newValue !== undefined && prevValue !== undefined && newValue !== prevValue) {
                                $scope.model.pointer.nodeId = '';
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.layouts.inherits', function (newValue, prevValue) {
                            if (newValue !== undefined && prevValue !== undefined) {
                                if (newValue === true) {
                                    self.setHierarchyNodes($scope.model).then(function () {
                                        self.setSelectedLayout().catch(function (setEx) {
                                            logger.error(setEx);
                                        });
                                    }, function (ex) {
                                        logger.error(ex);
                                    });
                                }
                                else {
                                    self.setSelectedLayout().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.secure.inherits', function (newValue, prevValue) {
                            if (newValue !== undefined && prevValue !== undefined) {
                                if (newValue === true) {
                                    self.setHierarchyNodes($scope.model).then(function () {
                                        self.setSelectedSSL().catch(function (setEx) {
                                            logger.error(setEx);
                                        });
                                    }, function (ex) {
                                        logger.error(ex);
                                    });
                                }
                                else {
                                    self.setSelectedSSL().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.roles.inherits', function (newValue, prevValue) {
                            if (newValue !== undefined && prevValue !== undefined) {
                                if (newValue === true) {
                                    self.setHierarchyNodes($scope.model).then(function () {
                                        self.setSelectedRoles().catch(function (setEx) {
                                            logger.error(setEx);
                                        });
                                    }, function (ex) {
                                        logger.error(ex);
                                    });
                                }
                                else {
                                    self.setSelectedRoles().catch(function (setEx) {
                                        logger.error(setEx);
                                    });
                                }
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('model.robots.inherits', function (newValue, prevValue) {
                            if (newValue !== undefined && prevValue !== undefined) {
                                if (newValue === true) {
                                    self.setHierarchyNodes($scope.model).then(function () {
                                        self.setSelectedRobots().catch(function (setEx) {
                                            logger.error(setEx);
                                        });
                                    }, function (ex) {
                                        logger.error(ex);
                                    });
                                }
                                else {
                                    self.setSelectedRobots().catch(function (setEx) {
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

                };
                NodeFormControllerBase.prototype = Object.create(controllers.FormControllerBase.prototype);

                NodeFormControllerBase.prototype.load = function () {
                    var deferred = this.ctor.$q.defer();

                    if (this.isNew()) {
                        deferred.resolve();
                    }
                    else {
                        this.ctor.$data.nodes.get(this.scope.id).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setHierarchyNodes = function (node) {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (node) {
                        var hierarchyNodeIds = _.filter(node.hierarchy, function (x) { return x !== self.scope.id; });
                        if (hierarchyNodeIds.length > 0) {
                            self.ctor.$data.nodes.get({ id: { $in: hierarchyNodeIds } }).then(function (nodes) {
                                var hierarchyNodes = [];

                                $(node.hierarchy).each(function (i, item) {
                                    var matchedNode = _.first(_.filter(nodes, function (x) { return x.id === item; }));
                                    if (matchedNode) {
                                        hierarchyNodes.push(matchedNode);
                                    }
                                });

                                self.scope.nodes = hierarchyNodes;
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

                NodeFormControllerBase.prototype.setSelectedLayout = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (this.scope.model.layouts && this.scope.model.layouts.inherits) {
                        this.scope.draftValues.layouts = this.scope.values.layouts;

                        var layouts = [];

                        $(self.scope.model.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(self.scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.layouts.inherits) {
                                    layouts = matchedNode.layouts.value;
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        self.scope.values.layouts = layouts;
                        deferred.resolve(layouts);
                    }
                    else {
                        var layouts = self.scope.draftValues.layouts;
                        self.scope.values.layouts = layouts;
                        deferred.resolve(self.scope.values.layouts);
                    }

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setSelectedSSL = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (this.scope.model.secure && this.scope.model.secure.inherits) {
                        this.scope.draftValues.secure = this.scope.values.secure;

                        var ssl = false;

                        $(self.scope.model.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(self.scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.secure.inherits) {
                                    ssl = matchedNode.secure.value;
                                }
                            }
                            else {
                                return false;
                            }
                        });
                        self.scope.values.secure = ssl;
                        deferred.resolve(ssl);
                    }
                    else {
                        self.scope.values.secure = self.scope.draftValues.secure;
                        deferred.resolve(self.scope.values.secure);
                    }

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setSelectedRoles = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (this.scope.model.roles && this.scope.model.roles.inherits) {
                        this.scope.draftValues.roles = this.scope.values.roles.slice(0);

                        var roles = [];

                        $(self.scope.model.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(self.scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.roles.inherits) {
                                    roles = matchedNode.roles.value.slice(0);
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        this.scope.values.roles = roles;
                        deferred.resolve(roles);
                    }
                    else {
                        var roles = this.scope.draftValues.roles.slice(0);
                        this.scope.values.roles = roles;
                        deferred.resolve(roles);
                    }

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setSelectedRobots = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;
                    
                    if (this.scope.model.robots && this.scope.model.robots.inherits) {
                        this.scope.draftValues.robots = this.scope.values.robots.slice(0);

                        var robots = [];

                        $(self.scope.model.hierarchy).each(function (i, item) {
                            var matchedNode = _.first(_.filter(self.scope.nodes, function (x) { return x.id === item; }));
                            if (matchedNode) {
                                if (!matchedNode.robots.inherits) {
                                    robots = matchedNode.robots.value.slice(0);
                                }
                            }
                            else {
                                return false;
                            }
                        });

                        this.scope.values.robots = robots;
                        deferred.resolve(robots);
                    }
                    else {
                        var robots = this.scope.draftValues.robots.slice(0);
                        this.scope.values.robots = robots;
                        deferred.resolve(robots);
                    }

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setParentEntities = function () {
                    var deferred = this.ctor.$q.defer();

                    var parentEntities = [];

                    for (var entityName in this.ctor.$jsnbt.entities) {
                        var entity = this.ctor.$jsnbt.entities[entityName];
                        if (_.isArray(entity.allowed)) {
                            if (entity.allowed.indexOf(this.scope.model.entity) !== -1) {
                                parentEntities.push(entity.name);
                            }
                        }
                    }

                    this.scope.parentOptions.entities = parentEntities;

                    deferred.resolve(parentEntities);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setTemplate = function () {
                    var deferred = this.ctor.$q.defer();

                    if (this.scope.route && this.scope.route.current) {
                        this.scope.template = this.scope.route.current.template;
                    }
                    else {
                        this.scope.template = undefined;
                    }

                    deferred.resolve();

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setTemplateForm = function () {
                    var deferred = this.ctor.$q.defer();

                    if (this.scope.model && this.scope.model.entity !== 'pointer') {
                        var jtmpl = this.ctor.$jsnbt.templates[this.scope.model.template];

                        if (jtmpl) {
                            this.scope.form = jtmpl.form;
                        }
                        else {
                            this.scope.form = undefined;
                        }
                    }
                    else {
                        this.scope.form = undefined;
                    }

                    deferred.resolve();

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setSeo = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (this.scope.model && this.scope.model.parent && this.scope.model.parent !== '') {
                        this.ctor.$data.nodes.get({ id: this.scope.model.parent }).then(function (parentResult) {
                            var nodeIds = parentResult.hierarchy;

                            if (nodeIds.length > 0) {

                                var languageCodes = self.scope.application.localization.enabled ? _.pluck(self.scope.application.languages, 'code') : [self.scope.defaults.language];

                                self.ctor.$data.nodes.get({ id: { $in: nodeIds } }).then(function (results) {
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

                                    self.scope.seoNames = newSeoNodes;
                                    deferred.resolve(newSeoNodes);

                                }).catch(function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                self.scope.seoNames = [];
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

                NodeFormControllerBase.prototype.setLayouts = function () {
                    var deferred = this.ctor.$q.defer();

                    var layouts = [];
                    for (var layoutName in this.ctor.$jsnbt.layouts) {
                        var layout = this.ctor.$jsnbt.layouts[layoutName];

                        layouts.push({
                            id: layout.id,
                            name: layout.name
                        });
                    };

                    this.scope.layouts = layouts;

                    deferred.resolve(layouts);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setRoles = function () {
                    var deferred = this.ctor.$q.defer();

                    var allRoles = [];

                    for (var roleName in this.ctor.$jsnbt.roles) {
                        var role = this.ctor.$jsnbt.roles[roleName];

                        if (!this.ctor.AuthService.isInRole({ roles: [role.name] }, 'admin')) {
                            var newRole = {};
                            $.extend(true, newRole, role);
                            newRole.value = newRole.name;
                            newRole.disabled = !this.ctor.AuthService.isInRole(this.scope.current.user, role.name);
                            newRole.description = role.inherits.length > 0 ? 'inherits from ' + role.inherits.join(', ') : '';
                            allRoles.push(newRole);
                        }
                    };

                    this.scope.roles = allRoles;

                    deferred.resolve(allRoles);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setRobots = function () {
                    var deferred = this.ctor.$q.defer();

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

                    this.scope.robots = robots;

                    deferred.resolve(robots);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setModules = function () {
                    var deferred = this.ctor.$q.defer();

                    var modules = [];
                    for (var moduleName in this.ctor.$jsnbt.modules) {
                        var module = this.ctor.$jsnbt.modules[moduleName];
                        if (module.pointed) {
                            modules.push({
                                name: module.name,
                                domain: module.domain
                            });
                        }
                    }
                    this.scope.modules = modules;

                    deferred.resolve(modules);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setLanguages = function () {
                    var deferred = this.ctor.$q.defer();

                    var results = this.scope.application.languages;

                    this.scope.languages = results;

                    deferred.resolve(results);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setLanguage = function () {
                    var deferred = this.ctor.$q.defer();

                    var result = this.scope.defaults.language ? this.scope.defaults.language : _.first(this.scope.application.languages).code;

                    this.scope.language = result;

                    deferred.resolve(result);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setEntities = function () {
                    var deferred = this.ctor.$q.defer();

                    var types = [];

                    if (this.scope.domain === 'core') {
                        types.push({ value: 'page', name: 'page' });

                        var pointerModules = false;
                        for (var moduleName in this.ctor.$jsnbt.modules) {
                            var module = this.ctor.$jsnbt.modules[moduleName];
                            if (module.pointed) {
                                pointerModules = true;
                            }
                        }

                        if (pointerModules)
                            types.push({ value: 'pointer', name: 'pointer' });

                        if (_.keys(this.ctor.$jsnbt.routes).length > 0)
                            types.push({ value: 'router', name: 'router' });
                    }
                    else {
                        for (var entityName in this.ctor.$jsnbt.entities) {
                            if (this.ctor.$jsnbt.entities[entityName].domain === this.scope.domain) {
                                types.push({ value: entityName, name: this.ctor.$jsnbt.entities[entityName].name });
                            }
                        }
                    }

                    this.scope.entities = types;

                    deferred.resolve(types);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setRoutes = function () {
                    var deferred = this.ctor.$q.defer();

                    var routes = [];
                    for (var routeName in this.ctor.$jsnbt.routes) {
                        routes.push(this.ctor.$jsnbt.routes[routeName]);
                    }

                    this.scope.routes = routes;

                    deferred.resolve(routes);

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.setViews = function () {
                    var deferred = this.ctor.$q.defer();

                    var templates = {};

                    for (var entityName in this.ctor.$jsnbt.entities) {
                        templates[entityName] = [];

                        for (var templateName in this.ctor.$jsnbt.templates) {
                            var template = this.ctor.$jsnbt.templates[templateName];

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

                    this.scope.templates = templates;

                    deferred.resolve();

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.set = function (data) {
                    var deferred = this.ctor.$q.defer();

                    if (this.isNew()) {
                        this.setTitle('');

                        var entity = undefined;

                        if (this.scope.entity)
                            entity = this.scope.entity.name;
                        else
                            if (this.scope.parent)
                                entity = this.scope.parent.entity;

                        this.scope.model = this.ctor.$data.create('nodes', {
                            domain: this.scope.domain,
                            entity: entity,
                            parent: this.scope.parent ? this.scope.parent.id : '',
                            hierarchy: this.scope.parent ? this.scope.parent.hierarchy : []
                        });

                        this.scope.localized = this.scope.application.localization.enabled && (entity.localized === undefined || entity.localized === true);

                        this.setValid(true);
                        this.setPublished(false);

                        deferred.resolve(this.scope.model);
                    }
                    else {
                        if (data) {
                            this.setTitle(data.title[this.scope.defaults.language]);

                            this.scope.model = data;

                            var matchedEntity = this.ctor.$jsnbt.entities[data.entity] || {};
                            this.scope.localized = this.scope.application.localization.enabled && (matchedEntity.localized === undefined || matchedEntity.localized === true);

                            this.scope.entity = matchedEntity;

                            this.scope.parentOptions.restricted = [data.id];

                            this.setValid(true);
                            this.setPublished(true);

                            deferred.resolve(this.scope.model);
                        }
                        else {
                            deferred.reject(new Error('data is not defined for setting into scope'));
                        }
                    }

                    return deferred.promise;
                };
                
                NodeFormControllerBase.prototype.get = function () {
                    return this.scope.model;
                };

                NodeFormControllerBase.prototype.validate = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;
                    var args = arguments;

                    var checkExtras = function (lang) {
                        var deferredInternal = self.ctor.$q.defer();

                        if (self.scope.model.active[lang]) {
                            if (self.scope.entity.properties.seo) {
                                self.ctor.$data.nodes.get({ parent: self.scope.model.parent, domain: self.scope.model.domain, id: { $nin: [self.scope.model.id] } }).then(function (siblingsResponse) {
                                    self.scope.siblings = siblingsResponse;

                                    var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingsResponse, function (x) { return x.seo[lang]; }), 'seo'), lang);

                                    self.scope.validation.seo = self.scope.model.seo[lang] && siblingSeoNames.indexOf(self.scope.model.seo[lang]) === -1;

                                    if (!self.scope.validation.seo)
                                        self.scope.valid = false;

                                    deferredInternal.resolve(self.scope.valid);

                                }, function (siblingsError) {
                                    deferredInternal.reject(siblingsError);
                                });
                            }
                            else {
                                deferredInternal.resolve(self.scope.valid);
                            }
                        }
                        else {
                            deferredInternal.resolve(self.scope.valid);
                        }

                        return deferredInternal.promise;
                    };

                    self.setValid(true);
                    self.scope.validation.seo = true;

                    _.each(self.controls, function (c) {
                        if (typeof (c.initValidation) === 'function')
                            c.initValidation();
                    })
                    
                    this.ctor.$q.all(_.map(_.filter(self.controls, function (f) { return typeof (f.isValid) === 'function'; }), function (x) { return x.isValid(); })).then(function (result) {

                        self.setValid(_.all(result, function (x) { return x === true; }));

                        if (!self.isValid()) {
                            deferred.resolve(false);
                        }
                        else {

                            checkExtras(self.scope.language).then(function (validationResults) {

                                if (!validationResults) {
                                    deferred.resolve(false);
                                }
                                else {

                                    jsnbt.controllers.FormControllerBase.prototype.validate.apply(self, arguments).then(function (valResults) {
                                        deferred.resolve(valResults);
                                    }).catch(function (valError) {
                                        deferred.reject(valError);
                                    });

                                }

                            }, function (validationError) {
                                deferred.reject(validationError);
                            });

                        }
                    });

                    return deferred.promise;
                };

                NodeFormControllerBase.prototype.push = function (data) {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (this.isNew()) {
                        this.ctor.$data.nodes.post(data).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        this.ctor.$data.nodes.put(this.scope.id, data).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

                return NodeFormControllerBase;

            })(controllers.NodeFormControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();