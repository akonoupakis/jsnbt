/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('wgtMessages', ['$rootScope', '$data', function ($rootScope, $data) {

            var MessagesWidget = function (scope, element, attrs) {
                element.addClass('wgt-messages');

                scope.messages = [];

                $data.messages.get({
                    read: {
                        $ne: scope.current.user.id
                    },
                    $sort: { timestamp: 1 }
                }).then(function (response) {
                    scope.messages = response;
                }).catch(function (ex) {
                    throw ex;
                });

                scope.dismiss = function (message) {
                    $data.messages.put(message.id, {
                        $push: {
                            read: scope.current.user.id
                        }
                    }).then(function (response) {
                        scope.messages = _.filter(scope.messages, function (x) { return x.id !== message.id });
                    }).catch(function (ex) {
                        throw ex;
                    });
                };

            };

            return {
                restrict: 'E',
                replace: true,
                link: function (scope, element, attrs) {
                    return new MessagesWidget(scope, element, attrs);
                },
                templateUrl: 'tmpl/core/widgets/wgtMessages.html'
            };

        }]);

})();