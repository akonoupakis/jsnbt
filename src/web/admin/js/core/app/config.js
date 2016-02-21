(function () {
    "use strict";

    angular.module('jsnbt')
        .config(['$jsnbtProvider', function ($jsnbtProvider) {

            $jsnbtProvider.setSettings(jsnbt);

        }]);
})();