/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.modules = (function (modules) {

            for (var moduleName in modules) {
                var module = modules[moduleName];

                module.lookup = function (selected, options) {
                    var moduleDomain = this.domain;
                    var lookupOptions = {};
                    $.extend(true, lookupOptions, {
                        title: 'select a content node',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/modals/nodeSelector.html',
                        domain: moduleDomain,
                        mode: 'single',
                        options: options
                    });
                    return lookupOptions;
                };

                module.lookupMany = function (selected, options) {
                    var moduleDomain = this.domain;
                    var lookupOptions = {};
                    $.extend(true, lookupOptions, {
                        title: 'select the content nodes you want',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/modals/nodeSelector.html',
                        domain: moduleDomain,
                        mode: 'multiple',
                        options: options
                    });
                    return lookupOptions;
                };
            }

            modules.core = (function (coreModule) {

                coreModule.lookup = function (selected, options) {
                    var lookupOptions = {};
                    $.extend(true, lookupOptions, {
                        title: 'select a content node',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/modals/nodeSelector.html',
                        domain: 'core',
                        mode: 'single',
                        options: options
                    });
                    return lookupOptions;
                };

                coreModule.lookupMany = function (selected, options) {
                    var lookupOptions = {};
                    $.extend(true, lookupOptions, {
                        title: 'select the content nodes you want',
                        controller: 'NodeSelectorController',
                        selected: selected,
                        template: 'tmpl/core/modals/nodeSelector.html',
                        domain: 'core',
                        mode: 'multiple',
                        options: options
                    });
                    return lookupOptions;
                };

                return coreModule;

            })(modules.core || {});

            return modules;

        })(jsnbt.modules || {});

        return jsnbt;

    })(jsnbt || {});
    
})();