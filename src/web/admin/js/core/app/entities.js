/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.entities = (function (entities) {

            for (var entityName in entities) {
                var entity = entities[entityName];

                entity.editable = true;
                entity.viewable = false;
                entity.deletable = true;
                entity.parentable = true;

                entity.getCreateUrl = function (node) {
                    return '/content/nodes/new' + (node ? '-' + node.id : '');
                };
                entity.getEditUrl = function (node) {
                    return '/content/nodes/' + node.id
                };
                entity.getViewUrl = function (node) {
                    throw new Error('na');
                };


                if (entity.domain === 'core') {
                    entity.lookupNode = function (fn, mode, selected, options) {
                        fn.scope({
                            selected: selected,
                            domain: this.domain,
                            mode: mode
                        });
                        fn.scope(options);
                    };
                }
            }

            return entities;

        })(jsnbt.entities || {});

        return jsnbt;

    })(jsnbt || {});
    
})();