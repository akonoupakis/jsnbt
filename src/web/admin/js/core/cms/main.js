/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt')
    .config(['$routerProvider', '$jsnbtProvider', 'flowFactoryProvider', function ($routerProvider, $jsnbtProvider, flowFactoryProvider) {

        $jsnbtProvider.setSettings(jsnbt);

        if ($('.error-page').length === 1)
            return;

        var router = new jsnbt.ViewRouter('core', $routerProvider);

        var TEMPLATE_BASE = jsnbt.constants.TEMPLATE_BASE;

        router.when('/', function (x) {
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/dashboard.html');
            x.controller('DashboardController');
        });

        router.when('/dashboard', function (x) {
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/dashboard.html');
            x.controller('DashboardController');
        });

        router.when('/content', function (x) {
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/content.html');
            x.controller('ContentController');
        });

        if (jsnbt.localization.enabled) {
            router.when('/content/languages', function (x) {
                x.section('languages');
                x.baseTemplate(TEMPLATE_BASE.list);
                x.template('tmpl/core/pages/content/languages.html');
                x.controller('LanguagesController');
            });
            router.when('/content/languages/:id', function (x) {
                x.section('languages');
                x.baseTemplate(TEMPLATE_BASE.form);
                x.template('tmpl/core/pages/content/language.html');
                x.controller('LanguageController');
            });
        }

        router.when('/content/layouts', function (x) {
            x.section('layouts');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/layouts.html');
            x.controller('LayoutsController');
        });
        router.when('/content/layouts/:id', function (x) {
            x.section('layouts');
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/content/layout.html');
            x.controller('LayoutController');
        });

        router.when('/content/nodes', function (x) {
            x.section('nodes');
            x.baseTemplate(TEMPLATE_BASE.tree);
            x.template('tmpl/core/pages/content/nodes.html');
            x.scope({
                prefix: '/content/nodes'
            });
            x.controller('NodesController');
        });
        router.when('/content/nodes/:id', function (x) {
            x.section('nodes');
            x.baseTemplate(TEMPLATE_BASE.nodeForm);
            x.scope({
                prefix: '/content/nodes'
            });
            x.controller('NodeController');
        });

        router.when('/content/data', function (x) {
            x.section('data');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/data.html');
            x.controller('DataController');
        });
        router.when('/content/data/:list', function (x) {
            x.section('data');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/dataList.html');
            x.controller('DataListController');
        });
        router.when('/content/data/:list/:id', function (x) {
            x.section('data');
            x.baseTemplate(TEMPLATE_BASE.dataForm);
            x.controller('DataListItemController');
        });

        router.when('/modules', function (x) {
            x.section('modules');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/modules.html');
            x.controller('ModulesController');
        });

        router.when('/content/texts', function (x) {
            x.section('texts');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/texts.html');
            x.controller('TextsController');
        });
        router.when('/content/texts/:id', function (x) {
            x.section('texts');
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/content/text.html');
            x.controller('TextController');
        });

        router.when('/content/files', function (x) {
            x.section('files');
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/content/files.html');
            x.controller('FilesController');
        });

        router.when('/users', function (x) {
            x.section('users');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/users.html');
            x.controller('UsersController');
        });
        router.when('/users/:id', function (x) {
            x.section('users');
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/user.html');
            x.controller('UserController');
        });

        router.when('/settings', function (x) {
            x.section('settings');
            x.baseTemplate(TEMPLATE_BASE.settings);
            x.template('tmpl/core/pages/settings.html');
            x.controller('SettingsController');
        });

        router.when('/account', function (x) {
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/account.html');
            x.controller('AccountController');
        });

        router.otherwise(function (x) {
            x.template('tmpl/core/common/404.html');
            x.controller('NotFoundController');
        });

    }])
    .run(['$rootScope', '$router', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', 
        function ($rootScope, $router, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

            $rootScope.initiated = $rootScope.initiated || false;
            $rootScope.users = 0;

        }]);
})();