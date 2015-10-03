/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {
        
        jsnbt.entities = (function (entities) {

            for (var entityName in jsnbt.entities) {
                var entity = jsnbt.entities[entityName];

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
            }

            return entities;

        })(jsnbt.entities || {});

        return jsnbt;

    })(jsnbt || {});
    
})();