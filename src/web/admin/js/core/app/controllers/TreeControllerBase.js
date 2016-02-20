/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.TreeControllerBase = (function (TreeControllerBase) {

                TreeControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.localization = true;

                    $scope.found = undefined;

                    $scope.model = [];

                    if ($scope.modal && $scope.modal.selector === 'node') {
                        this.enqueue('set', '', function (data) {
                            self.setSelected($scope.modal.selected);
                        });

                        $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                            self.requested();
                        });

                        $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                            sender.stopPropagation();
                            self.selected(selected);
                        });

                        $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                            sender.stopPropagation();
                            self.submitted(selected);
                        });
                    }
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
                        self.ctor.TreeNodeService.getNodes({
                            identifier: self.scope.cacheKey,
                            domain: self.scope.domain,
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
                    this.ctor.TreeNodeService.setSelected(this.scope.model, this.scope.modal && this.scope.modal.mode === 'multiple' ? selected : [selected]);
                };

                TreeControllerBase.prototype.getSelected = function () {
                    var selected = this.scope.modal && this.scope.modal.mode === 'single' ? _.first(this.ctor.TreeNodeService.getSelected(this.scope.model)) : this.ctor.TreeNodeService.getSelected(this.scope.model);
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

                    controllers.ControllerBase.prototype.init.apply(this, arguments).then(function () {

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
                                                                deferred.resolve(setted);
                                                            }).catch(function (watchError) {
                                                                deferred.reject(watchError);
                                                            });
                                                        }).catch(function (setError) {
                                                            deferred.reject(setError);
                                                        });
                                                    }).catch(function (settedError) {
                                                        deferred.reject(settedError);
                                                    });
                                                }).catch(function (settingError) {
                                                    deferred.reject(settingError);
                                                });
                                            }).catch(function (loadedError) {
                                                deferred.reject(loadedError);
                                            });
                                        }).catch(function (loadError) {
                                            var parsedLoadError = _.isString(loadError) ? JSON.parse(loadError) : loadError;
                                            if (_.isObject(parsedLoadError) && parsedLoadError.statusCode === 404) {
                                                self.scope.found = false;
                                                deferred.resolve();
                                            }
                                            else {
                                                deferred.reject(loadError);
                                            }
                                        });
                                    }).catch(function (loadingError) {
                                        deferred.reject(loadingError);
                                    });
                                }, function (preloadedError) {
                                    deferred.reject(preloadedError);
                                });
                            }).catch(function (preloadError) {
                                deferred.reject(preloadError);
                            });
                        }).catch(function (preloadingError) {
                            deferred.reject(preloadingError);
                        });

                    }).catch(function (initError) {
                        deferred.reject(initError);
                    });

                    return deferred.promise;
                };

                return TreeControllerBase;

            })(controllers.TreeControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();