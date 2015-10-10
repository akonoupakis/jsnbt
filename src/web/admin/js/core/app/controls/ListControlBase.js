/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controls = (function (controls) {

            controls.ListControlBase = (function (ListControlBase) {

                ListControlBase = function (scope, element, attrs, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controls.ControlBase.apply(this, $rootScope.getBaseArguments(scope, element, attrs));

                    var self = this;
                    
                    this.scope = scope;
                    this.element = element;
                    this.attrs = attrs;

                    this.$q = $q;
                    this.$timeout = $timeout;

                    scope.id = Math.random().toString().replace('.', '');                    

                    this.initiated = false;
                    
                };
                ListControlBase.prototype = Object.create(controls.ControlBase.prototype);

                ListControlBase.prototype.init = function (time) {
                    var deferred = this.$q.defer();

                    var self = this;

                    if (time) {
                        this.$timeout(function () {
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