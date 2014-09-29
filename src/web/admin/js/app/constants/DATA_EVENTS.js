/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('DATA_EVENTS', {

            dataCreated: 'dataCreated',
            dataUpdated: 'dataUpdated',
            dataDeleted: 'dataDeleted',

            draftCreated: 'draftsCreated',
            draftUpdated: 'draftsUpdated',
            draftDeleted: 'draftsDeleted',

            languageCreated: 'languagesCreated',
            languageUpdated: 'languagesUpdated',
            languageDeleted: 'languagesDeleted',

            nodeCreated: 'nodesCreated',
            nodeUpdated: 'nodesUpdated',
            nodeDeleted: 'nodesDeleted',

            settingCreated: 'settingsCreated',
            settingUpdated: 'settingsUpdated',
            settingDeleted: 'settingsDeleted',

            textsCreated: 'textsCreated',
            textsUpdated: 'textsUpdated',
            textsDeleted: 'textsDeleted',

            usersCreated: 'usersCreated',
            usersUpdated: 'usersUpdated',
            usersDeleted: 'usersDeleted'

        });
})();