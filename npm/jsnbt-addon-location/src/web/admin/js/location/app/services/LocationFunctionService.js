;(function () {
    "use strict";

    angular.module("jsnbt-addon-location")
        .factory('LocationFunctionService', function ($q, ModalService) {
            var LocationFunctionService = {

                getEditUrl: function (node) {
                    return '/modules/location/nodes/' + (node.entity === 'location-category' ? '' : 'location/') + node.id;
                }

            };
           
            return LocationFunctionService;
        });
})();