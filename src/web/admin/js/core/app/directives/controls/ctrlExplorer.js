/* global angular:false */

(function () {

    "use strict";

    angular.module('jsnbt')
        .directive('ctrlExplorer', ['FileService', 'ModalService', 'CONTROL_EVENTS', function (FileService, ModalService, CONTROL_EVENTS) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    ngPath: '=',
                    ngGroup: '=',
                    ngSelectable: '=',
                    ngSelectMode: '=',
                    ngSelected: '=',
                    ngExtensions: '='
                },
                link: function (scope, element, attrs) {
                    element.addClass('ctrl');
                    element.addClass('ctrl-explorer');
                    
                    scope.ctrl = 'ctrlExplorer';

                    scope.new = '';
                    scope.current = '';
                    scope.breadcrumb = [];
                    scope.contents = [];
                    scope.selected = {};

                    var fileGroup = scope.ngGroup ? scope.ngGroup : 'public';
                    
                    if (scope.ngSelectable) {
                        if (scope.ngSelectMode === 'single') {
                            if (scope.ngSelected && scope.ngSelected !== '')
                                scope.selected[scope.ngSelected] = true;
                        }
                        else {
                            $(scope.ngSelected).each(function (i, item) {
                                scope.selected[item] = true;
                            });
                        }
                    }

                    var map = {
                        'compressed': ['zip', 'rar', 'gz', '7z'],
                        'text': ['txt', 'md'],
                        'image': ['jpg', 'jpge', 'png', 'gif', 'bmp'],
                        'pdf': ['pdf'],
                        'css': ['css'],
                        'html': ['html'],
                        'word': ['doc', 'docx'],
                        'powerpoint': ['ppt', 'pptx'],
                        'movie': ['mkv', 'avi', 'rmvb'],
                    };

                    var loadBreadcrumb = function (path) {

                        var internalPath = path.substring(fileGroup.length + 1);

                        if (internalPath === '/') {
                            scope.breadcrumb = [{
                                name: 'root',
                                url: '/' + fileGroup,
                                active: true
                            }];
                        }
                        else {
                            var paths = _.string.trim(internalPath, '/').split('/');
                            var breadcrumbs = [{
                                name: 'root',
                                url: '/' + fileGroup,
                                active: false
                            }];

                            var urlPart = '/' + fileGroup;

                            $(paths).each(function (i, item) {
                                urlPart += '/' + item;
                                breadcrumbs.push({
                                    name: item,
                                    url: urlPart,
                                    active: i === (paths.length - 1)
                                });
                            });

                            scope.breadcrumb = breadcrumbs;
                        }
                    };

                    var apply = function (items) {
                        var results = [];

                        $(items).each(function (i, item) {
                            item.icon = 'blank';
                            if (item.type === 'folder')
                                item.icon = 'folder';
                            
                            for (var key in map) {
                                if (_.include(map[key], item.ext.replace('.', ''))) {
                                    item.icon = key;
                                    break;
                                }
                            }

                            if (!item.icon)
                                item.icon = 'blank';
                            
                            if (item.type === 'folder') {
                                results.push(item);
                            }
                            else {
                                if (scope.ngExtensions && scope.ngExtensions.length > 0) {
                                    if (scope.ngExtensions.indexOf(item.ext) !== -1) {
                                        results.push(item);
                                    }
                                }
                                else {
                                    results.push(item);
                                }
                            }
                            
                        });

                        return results;
                    };

                    var scrollToTop = function () {
                        if (!scope.ngSelectable)
                            $('body').scrollTo(element, { offset: -150, duration: 400 });
                    };

                    var load = function (path) {
                        FileService.get(path).then(function (response) {
                            scope.contents = apply(response);
                        }, function (error) {
                            throw error;
                        });
                    };

                    scope.$watch('current', function (newValue, prevValue) {
                        if (newValue && newValue !== '') {
                            loadBreadcrumb(newValue);
                            load(newValue);
                        }
                    });
                    
                    scope.select = function (item) {
                        if (scope.ngSelectable && item.type === 'file') {
                            if (scope.ngSelectMode === 'multiple') {
                                scope.selected[item.location] = !(scope.selected[item.location] || false);
                            }
                            else {
                                scope.selected = {};
                                scope.selected[item.location] = true;
                            }
                        }
                    };

                    scope.open = function (item) {
                        if (typeof (item) === 'string') {
                            scope.current = item;
                            scrollToTop();
                        }
                        else {
                            if (item.type === 'folder') {
                                scope.current = item.path;
                                scrollToTop();
                            }
                            else {
                                if (scope.ngSelectable && item.type === 'file') {
                                    if (scope.ngSelectMode === 'single') {
                                        scope.select(item);
                                        scope.$emit(CONTROL_EVENTS.valueSelected, item.location);
                                    }
                                }
                            }
                        }
                    };

                    scope.create = function () {
                        if (scope.new && scope.new !== '') {
                            FileService.create(scope.current, scope.new).then(function (response) {
                                if (response) {
                                    scope.new = '';
                                    load(scope.current);
                                    scrollToTop();
                                }
                                else {
                                    load(scope.current);
                                }
                            }, function (error) {
                                throw error;
                            });
                        }
                    };

                    scope.upload = function () {
                        ModalService.open({
                            title: 'upload files',
                            controller: 'FileUploadController',
                            template: 'tmpl/core/modals/fileUpload.html',
                            path: scope.current
                        }).then(function (result) {
                            load(scope.current);
                            scrollToTop();
                        }, function () {
                            load(scope.current);
                            scrollToTop();
                        });
                    };

                    scope.edit = function (item) {
                        ModalService.open({
                            title: 'edit this ' + item.type,
                            controller: 'FileSystemEditorController',
                            template: 'tmpl/core/modals/fsEditor.html',
                            group: fileGroup,
                            data: item
                        }).then(function (result) {
                            if (result !== '' && result !== item.path) {
                                FileService.move(item.path, result).then(function (response) {
                                    load(scope.current);
                                    if (response)
                                        scrollToTop();
                                }, function (error) {
                                    throw error;
                                });
                            }
                        });
                    };

                    scope.delete = function (item) {
                        ModalService.open({
                            title: 'are you sure you want to delete the ' + item.type + ' ' + item.name + '?',
                            controller: 'DeletePromptController',
                            template: 'tmpl/core/modals/deletePrompt.html'
                        }).then(function (confirmed) {
                            if (confirmed) {
                                FileService.delete(item.path).then(function (response) {
                                    load(scope.current);
                                }, function (error) {
                                    throw error;
                                });
                            }
                        });
                    };

                    var createElement = $('input[data-input="create"]', element);
                    var chars = createElement.data('allowed-chars');
                    createElement.on("keypress", function (event) {
                        var char = String.fromCharCode(event.which);
                        if (chars.indexOf(char) === -1)
                            event.preventDefault();
                    });
                    
                    scope.$on(CONTROL_EVENTS.valueRequested, function (sender) {
                        if (scope.ngSelectMode === 'single') {
                            var sel = '';

                            for (var name in scope.selected) {
                                if (scope.selected[name] === true) {
                                    sel = name;
                                    break;
                                }
                            }

                            scope.$emit(CONTROL_EVENTS.valueSubmitted, sel);
                        }
                        else {
                            var selected = [];
                            
                            for (var name2 in scope.selected) {
                                if (scope.selected[name2] === true) {
                                    selected.push(name2);
                                }
                            }
                            
                            scope.$emit(CONTROL_EVENTS.valueSubmitted, selected);
                        }
                    });

                    var currentPath = scope.ngPath || '/';
                    if (currentPath == '/')
                        currentPath += fileGroup + '/';

                    scope.current = currentPath.replace(/\\/, '/');
                },
                templateUrl: 'tmpl/core/controls/ctrlExplorer.html'
            };

        }]);

})();