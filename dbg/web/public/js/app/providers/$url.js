/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .provider("$url", function () {

            return {

                $get: function () {

                    return {

                        build: function (language, page, pointer) {
                            if (page.entity === 'pointer') {
                                return page.active[language] ? page.url[language] : undefined;
                            }
                            else {

                                if (page.domain === 'core') {
                                    return page.active[language] ? page.url[language] : undefined;
                                }
                                else {
                                    if (pointer) {
                                        if (pointer.active[language] && page.active[language]) {
                                            var pointerNodeIndex = page.hierarchy.indexOf(pointer.pointer.nodeId);
                                            if (pointerNodeIndex !== -1) {
                                                var cropUrlIndex = pointerNodeIndex + 1;
                                                var pageUrlParts = (page.url[language] || '').split('/');
                                                
                                                if (pageUrlParts.length >= cropUrlIndex) {

                                                    var pageQueryParts = (page.url[language] || '').split('?');
                                                    var pageUrl = _.first(pageQueryParts);
                                                    var pageQuery = pageQueryParts.length > 1 ? _.last(pageQueryParts) : '';

                                                    var remainingUrl = _.str.ltrim(pageUrl, '/').split('/').slice(cropUrlIndex).join('/');
                                                    
                                                    var resultUrl = pointer.url[language];

                                                    if (remainingUrl !== '')
                                                        resultUrl += '/' + remainingUrl;

                                                    if (pageQuery !== '')
                                                        resultUrl += '?' + pageQuery;

                                                    return resultUrl;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    };

                }

            };
        });
})();