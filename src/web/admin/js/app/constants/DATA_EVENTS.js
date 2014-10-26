/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('DATA_EVENTS', {

            dataCreated: 'dataCreated',
            dataUpdated: 'dataUpdated',
            dataDeleted: 'dataDeleted',

            languageCreated: 'languageCreated',
            languageUpdated: 'languageUpdated',
            languageDeleted: 'languageDeleted',

            nodeCreated: 'nodeCreated',
            nodeUpdated: 'nodeUpdated',
            nodeDeleted: 'nodeDeleted',

            settingCreated: 'settingCreated',
            settingUpdated: 'settingUpdated',
            settingDeleted: 'settingDeleted',

            textCreated: 'textCreated',
            textUpdated: 'textUpdated',
            textDeleted: 'textDeleted',

            userCreated: 'userCreated',
            userUpdated: 'userUpdated'

        });
})();