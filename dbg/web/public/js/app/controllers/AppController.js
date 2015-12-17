/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', function ($scope, $q, $jsnbt, $context, $data, $text, $link, $image) {
            
            // hold the page and pointer objects as is from the db
            var page = null;
            var pointer = null;

            // hold the $context parameters available in $scope
            $scope.language = $context.language;
            $scope.layoutId = $context.layout;
            $scope.pageId = $context.pageId;
            $scope.pointerId = $context.pointerId;

            // hold the localized resources available in $scope.
            $scope.text = {};

            // hold the flattened objects that will be injected into $scope
            $scope.layout = null;
            $scope.page = null;            
            $scope.pointer = null;

            // hold the page and pointer urls (for viewing only)
            $scope.pageUrl = null;
            $scope.pointerUrl = null;

            // hold the page children so that we make a simple node loop, building the target urls for every item
            $scope.children = [];
                        
            $scope.languages = [];
            $scope.localizedUrls = [];

            // method to be triggered on ng-init. 
            // the arguments would be either key or group names to filter on jsnbt.db.texts
            // the results will form an object with grouped text entries as intended from the data structure
            $scope.setTexts = function () {
                var textKeys = _.filter(arguments, function (x) { return typeof(x) === 'string' });
                if (textKeys.length > 0) {
                    $text.get($context.language, textKeys).then(function (response) {
                        $.extend(true, $scope.text, response);
                    }).catch(function (error) {
                        throw error;
                    });
                }
            };

            // quick method to flat a node object for a specific language
            $scope.flat = function (node) {
                var newObj = {};
                node = node || {};
                if (node.content && node.content.localized && node.content.localized[$scope.language])
                    $.extend(true, newObj, node.content.localized[$scope.language]);

                if (node.content && node.content.localized)
                    delete node.content.localized;

                if (node.content)
                    $.extend(true, newObj, node.content);

                if (node.url)
                    newObj.url = node.url[$scope.language];
                
                return newObj;
            }
            
            $scope.getImageSrc = function (image) {
                if (image && _.isObject(image) && image.src !== '' && _.isArray(image.gen))
                    return $image.build(image.src, image.gen);
                else
                    return;
            }

            // quick method to get the available languages for the site
            var getAvailableLanguages = function () {
                var deferred = $q.defer();

                if ($jsnbt.localization.enabled) {
                    // if the site is marked as multi-language
                    $data.languages.get({ active: true }).then(function (languageResults) {
                        var langaugeCodes = _.pluck(languageResults, 'code');
                        deferred.resolve(langaugeCodes);
                    }, function (languageError) {
                        deferred.reject(languageError);
                    });
                }
                else {
                    // or is marked to have a single language, where is defined on $jsnbt.localization.locale;
                    deferred.resolve([$jsnbt.localization.locale]);
                }
                
                return deferred.promise;
            };

            // get languages
            getAvailableLanguages().then(function (languageCodes) {

                $scope.languages = languageCodes;

                // get layout
                if ($scope.layoutId && $scope.layoutId !== '') {
                    $data.layouts.get({ layout: $scope.layoutId }).then(function (results) {
                        var layout = _.first(results);
                        if (layout)
                            $scope.layout = $scope.flat(layout);

                        console.log('layout', $scope.layout);
                    });
                }

                // get page and pointer nodes
                $data.nodes.get({
                    id: {
                        $in: [
                            $scope.pageId,
                            $scope.pointerId
                        ] 
                    }
                }).then(function (results) {
                    var pageResult = _.find(results, function (x) { return x.id === $scope.pageId; });
                    var pointerResult = _.find(results, function (x) { return x.id === $scope.pointerId; });
                    
                    if (pageResult) {
                        // assign local page variable
                        page = pageResult;
                        // assign $scope page variable
                        $scope.page = $scope.flat(pageResult);
                        // assign $scope pageUrl variable
                        $scope.pageUrl = $link.build($scope.language, pageResult, pointerResult);

                        $($scope.languages).each(function (li, lang) {
                            if (lang !== $scope.language) {
                                var targetLink = $link.build(lang, pageResult, pointerResult);
                                if(targetLink){
                                    $scope.localizedUrls.push({
                                        language: lang,
                                        url: targetLink
                                    });
                                }
                            }
                        });
                    }

                    if (pointerResult) {
                        // assign local pointer variable
                        pointer = pointerResult;
                        // assign $scope pointer variable
                        $scope.pointer = $scope.flat(pointerResult);
                        // assign $scope pointerUrl variable
                        $scope.pointerUrl = $link.build($scope.language, pointerResult);
                    }
                }, function (error) {
                    throw error;
                }).then(function () {
                    if (page) {
                        // get page children
                        $data.nodes.get({
                            parent: page.id,
                            domain: page.domain
                        }).then(function (childrenResults) {
                            // fill $scope.children array with some data for our loop
                            $(childrenResults).each(function (c, child) {
                                var childUrl = $link.build($scope.language, child, pointer);
                                var childFlat = $scope.flat(child);

                                $scope.children.push({
                                    id: child.id,
                                    name: child.name,
                                    url: childUrl,
                                    content: childFlat
                                })
                            });

                        }, function (childrenError) {
                            throw childrenError;
                        });
                    }
                });
            }, function (languageError) {
                throw languageError;
            });

        });

})();