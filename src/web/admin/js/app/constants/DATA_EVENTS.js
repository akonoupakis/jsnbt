/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .constant('DATA_EVENTS', {

            dataCreated: 'dataCreated',
            dataUpdated: 'dataUpdated',
            dataDeleted: 'dataDeleted',

            draftCreated: 'draftCreated',
            draftUpdated: 'draftUpdated',
            draftDeleted: 'draftDeleted',

            languageCreated: 'languageCreated',
            languageUpdated: 'languageUpdated',
            languageDeleted: 'languageDeleted',

            nodeCreated: 'nodeCreated',
            nodeUpdated: 'nodeUpdated',
            nodeDeleted: 'nodeDeleted',

            settingCreated: 'settingCreated',
            settingUpdated: 'settingUpdated',
            settingDeleted: 'settingDeleted',

            textsCreated: 'textCreated',
            textsUpdated: 'textUpdated',
            textsDeleted: 'textDeleted',

            usersCreated: 'userCreated',
            usersUpdated: 'userUpdated',
            usersDeleted: 'userDeleted'

        });
})();