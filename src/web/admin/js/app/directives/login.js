/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('login', function ($location) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngModel: '='
                },
                templateUrl: 'tmpl/partial/common/login.html',
                link: function (scope, element, attrs) {
                    element.addClass('login');

                    var showDialog = function () {
                        scope.visible = true;
                    };

                    scope.visible = true;
                    //scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
                    //scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);


                    scope.credentials = {
                        username: '',
                        password: ''
                    };

                    scope.login = function () {
                        
                        var iframe = $('<iframe />')
                            .addClass('loginIframe')
                            .css('display', 'none')
                            .prop('src', 'tmpl/partial/blank.html');
                            

                        element.append(iframe);
                        
                        iframe.load(function () {
                            iframe.unbind('load');
                            var form = $('<form />')
                            .prop('action', '/admin/logging')
                            .prop('method', 'POST')
                            .append(
                                $('<input />')
                                    .prop('type', 'text')
                                    .prop('id', 'username')
                                    .prop('name', 'username')
                                    .val(scope.credentials.username)
                            )
                            .append(
                                $('<input />')
                                    .prop('type', 'password')
                                    .prop('id', 'password')
                                    .prop('name', 'password')
                                    .val(scope.credentials.password)
                            )
                            .append(
                                $('<button />')
                                    .prop('type', 'submit')
                            );

                            iframe.contents().find('body').append(form);

                            form.submit();

                            iframe.remove();
                        });
                    };
                }
            };

        });

})();