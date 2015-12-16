/* global angular:false */

(function () {
    "use strict";

    var ContentController = function ($scope, $rootScope, $jsnbt, $location, $logger, $templateCache) {
        jsnbt.controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('ContentController');

        $scope.items = [];
        
        var defaultItems = [];
        
        if ($scope.application.localization.enabled) {
            defaultItems.push({
                id: 'languages',
                title: 'languages',
                body: 'the localization languages of the front end site',
                image: 'img/core/content/languages.png',
                url: '/content/languages'
            });
        }
        
        defaultItems.push({
            id: 'layouts',
            title: 'layouts',
            body: 'layout registrations for commonly used data',
            image: 'img/core/content/layouts.png',
            url: '/content/layouts'
        });

        defaultItems.push({
            id: 'nodes',
            title: 'nodes',
            body: 'the page system building the urls of the front end site',
            image: 'img/core/content/nodes.png',
            url: '/content/nodes'
        });

        if (_.any($jsnbt.lists, function (x) { return x.domain === 'public'; })) {
            defaultItems.push({
                id: 'data',
                title: 'data',
                body: 'data list catalogues with data of any type',
                image: 'img/core/content/data.png',
                url: '/content/data'
            });
        }

        defaultItems.push({
            id: 'texts',
            title: 'texts',
            body: 'the text translations for each language',
            image: 'img/core/content/texts.png',
            url: '/content/texts'
        });

        defaultItems.push({
            id: 'files',
            title: 'files',
            body: 'the jsnbt file manager',
            image: 'img/core/content/files.png',
            url: '/content/files'
        });

        this.init().then(function () {

            $scope.items = _.union(defaultItems, $jsnbt.content);

        }).catch(function (ex) {
            logger.error(ex);
        });
    };
    ContentController.prototype = Object.create(jsnbt.controllers.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ContentController', ['$scope', '$rootScope', '$jsnbt', '$location', '$logger', '$templateCache', ContentController]);
})();