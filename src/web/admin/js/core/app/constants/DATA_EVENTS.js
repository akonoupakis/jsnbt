(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.constants = (function (constants) {

            constants.DATA_EVENTS = {
                dataCreated: 'dataCreated',
                dataUpdated: 'dataUpdated',
                dataDeleted: 'dataDeleted',

                languageCreated: 'languagesCreated',
                languageUpdated: 'languagesUpdated',
                languageDeleted: 'languagesDeleted',

                nodeCreated: 'nodesCreated',
                nodeUpdated: 'nodesUpdated',
                nodeDeleted: 'nodesDeleted',

                settingCreated: 'settingsCreated',
                settingUpdated: 'settingsUpdated',
                settingDeleted: 'settingsDeleted',

                textCreated: 'textsCreated',
                textUpdated: 'textsUpdated',
                textDeleted: 'textsDeleted',

                userCreated: 'usersCreated',
                userUpdated: 'usersUpdated',

                layoutCreated: 'layoutsCreated',
                layoutUpdated: 'layoutsUpdated'
            };

            return constants;

        })(jsnbt.constants || {});

        return jsnbt;

    })(jsnbt || {});

    angular.module("jsnbt")
        .constant('DATA_EVENTS', jsnbt.constants.DATA_EVENTS);

})();