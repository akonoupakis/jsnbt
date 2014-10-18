/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodeController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $session, $q, $queue, $data, $route, ScrollSpyService, $fn, LocationService, AuthService, DATA_EVENTS, FORM_EVENTS) {

            var logger = $logger.create('NodeController');

            $scope.id = $routeParams.id;
            $scope.name = undefined;
            $scope.node = undefined;
            
            $scope.roleOptions = [];
            $scope.roles = [];
            $scope.draftRoles = [];

            $scope.seoNames = [];
            
            $scope.siblingSeoNames = [];
            $scope.restNodeCodes = [];

            $scope.types = [];
            $scope.languages = [];
            $scope.views = [];
            $scope.addons = [];

            $scope.localized = false;
            $scope.language = undefined;

            $scope.valid = true;
            $scope.validation = {
                seo: true,
                code: true
            };

            $scope.published = true;

            $scope.tmpl = null;
            
            $scope.tmpls = [];

            if ($route.current.$$route.tmpl) {
                if (typeof ($route.current.$$route.tmpl) === 'string') {
                    $scope.tmpls.push($route.current.$$route.tmpl);
                }
                else {
                    $($route.current.$$route.tmpl).each(function (i, item) {
                        $scope.tmpls.push(item);
                    });
                }
            }

            $scope.parentOptions = {
                restricted: [],
                entities: []
            };
           
            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.nodes.get($scope.id).then(function (result) {

                        $scope.name = result.name;
                        $scope.node = result;
                        $scope.localized = (result.localization || {}).enabled && $scope.application.localization.enabled;

                        $scope.parentOptions.restricted = [$scope.id];

                        $scope.valid = true;
                        $scope.published = true;

                        $scope.roles = result.permissions.roles;
                        $scope.draftRoles = result.permissions.roles;

                        deferred.resolve(result);
                        
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

                        var setLocInternal = function (hierarchy) {
                            $data.nodes.get({ id: { $in: hierarchy } }).then(function (results) {

                                $(hierarchy).each(function (i, item) {
                                    var resultNode = _.first(_.filter(results, function (x) { return x.id === item; }));
                                    if (resultNode) {
                                        breadcrumb.push({
                                            name: resultNode ? resultNode.name : '-',
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

                setRoles: function () {
                    var deferred = $q.defer();

                    var allRoles = [];
                    
                    $(jsnbt.roles).each(function (r, role) {
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

                setSelectedRoles: function () {
                    var deferred = $q.defer();

                    if ($scope.node.permissions.inherits) {
                        $scope.draftRoles = $scope.roles.slice(0);

                        var hierarchyNodeIds = _.filter($scope.node.hierarchy, function (x) { return x !== $scope.id; });
                        $data.nodes.get({ id: { $in: hierarchyNodeIds } }).then(function (nodes) {

                            var roles = [];

                            $($scope.node.hierarchy).each(function (i, item) {
                                var matchedNode = _.first(_.filter(nodes, function (x) { return x.id === item; }));
                                if (matchedNode) {
                                    if (!matchedNode.permissions.inherits) {
                                        roles = matchedNode.permissions.roles.slice(0);
                                    }
                                }
                                else {
                                    return false;
                                }
                            });
                                
                            $scope.roles = roles;
                            deferred.resolve(roles);

                        }, function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        var roles = $scope.draftRoles.slice(0);
                        $scope.roles = roles;
                        deferred.resolve(roles);
                    }

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

                    if ($scope.node && $scope.node.entity !== 'pointer') {
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

                                            $($scope.application.localization.enabled ? $scope.application.languages: ['en']).each(function (l, lang) {
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

                        $data.nodes.get({ parent: $scope.node.parent, domain: $scope.node.domain, id: { $nin: [$scope.id] } }).then(function (siblingsResponse) {
                                               
                            $scope.siblingSeoNames = _.pluck(_.pluck(_.pluck(_.pluck(_.filter(siblingsResponse, function (x) { return x.data && x.data.localized && x.data.localized[lang]; }), 'data'), 'localized'), lang), 'seoName');

                            $scope.validation.seo = ($scope.node.data.localized[lang] || {}).seoName !== '' && $scope.siblingSeoNames.indexOf(($scope.node.data.localized[lang] || {}).seoName) === -1;

                            if (!$scope.validation.seo)
                                $scope.valid = false;

                            $data.nodes.get({ id: { $nin: [$scope.id] }, domain: $scope.node.domain, $fields: { code: true } }).then(function (nodesResponse) {

                                $scope.restNodeCodes = _.pluck(nodesResponse, 'code');

                                $scope.validation.code = true;
                                if ($scope.node.code !== undefined && $scope.node.code !== '')
                                    if ($scope.restNodeCodes.indexOf($scope.node.code) !== -1) {
                                        $scope.validation.code = false;
                                    }
                                
                                if (!$scope.validation.code)
                                    $scope.valid = false;

                                deferredInternal.resolve($scope.valid);

                            }, function (nodesError) {
                                deferredInternal.reject(nodesError);
                            });

                        }, function (siblingsError) {
                            deferredInternal.reject(siblingsError);
                        });

                        return deferredInternal.promise;
                    };

                    $scope.valid = true;
                    $scope.validation.seo = true;
                    $scope.validation.code = true;
                    $scope.$broadcast(FORM_EVENTS.initiateValidation);

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
                                        
                                            $scope.$broadcast(FORM_EVENTS.initiateValidation);

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
                            if (!publishNode.permissions.inherits)
                                publishNode.permissions.roles = $scope.roles;
                            
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

                valid = $scope.siblingSeoNames.indexOf(value) === -1;
                $scope.validation.seo = valid;

                return valid;
            };

            $scope.validateCode = function (value) {
                var valid = true;

                if (value && value !== '') {
                    if ($scope.restNodeCodes.indexOf(value) !== -1) {
                        $scope.validation.code = false;
                    }
                }

                return valid;
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
                fn.discard().then(function () {
                }, function (ex) {
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
                        fn.setLocation().then(function () { }, function (locEx) {
                            logger.error(locEx);
                        });
                    }
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
            
            $scope.$watch('node.permissions.inherits', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    fn.setSelectedRoles().then(function () { }, function (ex) {
                        logger.error(ex);
                    });
                }
            });
            
            dpd.on(DATA_EVENTS.nodeUpdated, function (node) {
                // updated from another user??
            });
            
            dpd.on(DATA_EVENTS.nodeDeleted, function (node) {
                // throw 404 if is current not found
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
                fn.setRoles().then(function (rolesResponse) {
                    fn.setAddons().then(function (addonsResponse) {
                        fn.setLanguages().then(function (languagesResponse) {
                            fn.setLanguage().then(function (languageResponse) {
                                fn.setTypes().then(function (typesResponse) {
                                    fn.setViews().then(function (viewsResponse) {
                                        fn.set().then(function (setResponse) {
                                            fn.setSelectedRoles().then(function (selRolesResponse) {
                                                fn.setTmpl().then(function (tmplResponse) {
                                                }, function (tmplError) {
                                                    logger.error(tmplError);
                                                });
                                            }, function (selRolesError) {
                                                logger.error(selRolesError);
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
                }, function (rolesError) {
                    logger.error(rolesError);
                });
            }, 200);

        });
})();