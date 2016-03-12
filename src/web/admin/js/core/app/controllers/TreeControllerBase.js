/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.TreeControllerBase = (function (TreeControllerBase) {

                TreeControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.localization = true;

                    $scope.found = undefined;

                    $scope.model = [];

                    if ($scope.modal && $scope.modal.selector === $scope.selector) {
                        this.enqueue('set', '', function (data) {
                            if ($scope.modal.selected) {
                                self.setSelected($scope.modal.selected);
                            }
                        });
                    };
                };
                TreeControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                TreeControllerBase.prototype.preload = function () {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve();

                    return deferred.promise;
                };

                TreeControllerBase.prototype.load = function () {
                    var self = this;

                    var deferred = this.ctor.$q.defer();

                    var loadFn = function (parentIds) {
                        self.ctor.NodeService.getNodes({
                            identifier: self.scope.cacheKey,
                            domain: self.scope.modal && self.scope.modal.domain ? self.scope.modal.domain : self.scope.domain,
                            entities: self.scope.modal && self.scope.modal.entities ? self.scope.modal.entities : self.scope.entities,
                            parentId: '',
                            parentIds: parentIds || []
                        }).then(function (response) {
                            deferred.resolve(response);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    };

                    if ((self.scope.modal && self.scope.modal.mode === 'single' && self.scope.modal.selected) || (self.scope.modal && self.scope.modal.mode === 'multiple' && self.scope.modal.selected && self.scope.modal.selected.length > 0)) {
                        var selectedQry = self.scope.modal.mode === 'multiple' ? { id: { $in: self.scope.modal.selected } } : { id: { $in: [self.scope.modal.selected] } };

                        self.ctor.$data.nodes.get(selectedQry).then(function (nodes) {
                            var parentIds = [];
                            $(nodes).each(function (n, node) {
                                var nodeParentIds = node.hierarchy.reverse().slice(1).reverse();
                                $(nodeParentIds).each(function (np, nodeParent) {
                                    if (parentIds.indexOf(nodeParent) === -1)
                                        parentIds.push(nodeParent);
                                });
                            });

                            loadFn(parentIds);
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });

                    }
                    else {
                        loadFn();
                    }

                    return deferred.promise;
                };

                TreeControllerBase.prototype.set = function (data) {
                    var deferred = this.ctor.$q.defer();

                    this.scope.model = data;

                    deferred.resolve(this.scope.model);

                    return deferred.promise;
                };

                TreeControllerBase.prototype.remove = function (node) {
                    if (node.parent.id === '') {
                        this.scope.model[0].children = _.filter(this.scope.model[0].children, function (x) { return x.id !== node.id; });
                        this.scope.model[0].childCount = this.scope.model[0].children.length;
                    }
                    else {
                        node.parent.children = _.filter(node.parent.children, function (x) { return x.id !== node.id; });
                        node.parent.childCount = node.parent.children.length;

                        if (node.parent.childCount === 0)
                            node.parent.collapsed = true;
                    }
                };

                TreeControllerBase.prototype.select = function (selected) {
                    return selected.id;
                };

                TreeControllerBase.prototype.setSelected = function (selected) {
                    this.ctor.NodeService.setSelected(this.scope.model, this.scope.modal && this.scope.modal.mode === 'multiple' ? selected : [selected]);
                };

                TreeControllerBase.prototype.getSelected = function () {
                    var selected = this.scope.modal && this.scope.modal.mode === 'single' ? _.first(this.ctor.NodeService.getSelected(this.scope.model)) : this.ctor.NodeService.getSelected(this.scope.model);
                    return selected;
                };

                TreeControllerBase.prototype.requested = function () {
                    if (this.scope.modal) {
                        var selected = this.getSelected();
                        this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, selected);
                    }
                };

                TreeControllerBase.prototype.selected = function (selected) {
                    if (this.scope.modal)
                        this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
                };

                TreeControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    var resolve = function (data) {
                        self.scope.loading = false;
                        deferred.resolve(data);
                    };

                    var reject = function (ex) {
                        self.scope.loading = false;
                        deferred.reject(ex);
                    };

                    controllers.ControllerBase.prototype.init.apply(this, arguments).then(function () {
                        self.scope.loading = true;

                        self.run('preloading').then(function () {
                            self.preload().then(function () {
                                self.run('preloaded').then(function () {
                                    self.run('loading').then(function () {
                                        self.load().then(function (response) {
                                            self.scope.found = true;
                                            self.run('loaded', [response]).then(function () {
                                                self.run('setting', [response]).then(function () {
                                                    self.set(response).then(function (setted) {
                                                        self.run('set', [setted]).then(function () {
                                                            self.run('watch').then(function () {
                                                                resolve(setted);
                                                            }).catch(reject);
                                                        }).catch(reject);
                                                    }).catch(reject);
                                                }).catch(reject);
                                            }).catch(reject);
                                        }).catch(function (loadError) {
                                            var parsedLoadError = _.isString(loadError) ? JSON.parse(loadError) : loadError;
                                            if (_.isObject(parsedLoadError) && parsedLoadError.statusCode === 404) {
                                                self.scope.found = false;
                                                resolve();
                                            }
                                            else {
                                                reject(loadError);
                                            }
                                        });
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);

                    return deferred.promise;
                };

                return TreeControllerBase;

            })(controllers.TreeControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();