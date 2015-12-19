/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controls = (function (controls) {

            controls.ListControlBase = (function (ListControlBase) {

                ListControlBase = function (scope, element, attrs, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                    var self = this;
                                        
                    scope.id = Math.random().toString().replace('.', '');                    

                    this.initiated = false;
                    
                };
                ListControlBase.prototype = Object.create(controls.ControlBase.prototype);

                ListControlBase.prototype.properties = $.extend(true, controls.ControlBase.prototype.properties, {
                    ngModel: '=',
                    ngLanguage: '=',
                    ngSelectable: '=',
                    ngSelectMode: '='
                });

                ListControlBase.prototype.init = function (time) {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    if (time) {
                        this.ctor.$timeout(function () {
                            self.initiated = true;
                            deferred.resolve();
                        }, time);
                    }
                    else {
                        this.initiated = true;
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                return ListControlBase;

            })(controls.ListControlBase || {});

            return controls;

        })(jsnbt.controls || {});

        return jsnbt;

    })(jsnbt || {});

})();