/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.modules = (function (modules) {

            for (var moduleName in modules) {
                var module = modules[moduleName];

                module.lookupNode = function (fn, mode, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: this.domain,
                        mode: mode,
                        options: options
                    });
                };
            }

            modules.core = (function (coreModule) {

                coreModule.lookupNode = function (fn, mode, selected, options) {
                    fn.scope({
                        selected: selected,
                        domain: 'core',
                        mode: mode,
                        options: options
                    });
                };

                return coreModule;

            })(modules.core || {});

            return modules;

        })(jsnbt.modules || {});

        return jsnbt;

    })(jsnbt || {});
    
})();