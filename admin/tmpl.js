angular.module('jsnbt').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('admin/tmpl/core/base/base.html',
    "<div class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div ng-include=\"template\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/base/dataForm.html',
    "<div ng-show=\"found === true\" class=\"container-fluid affix-area form-buttons-container\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row \">\r" +
    "\n" +
    "            <div class=\"col-md-10\">\r" +
    "\n" +
    "                <div class=\"affix-container\">\r" +
    "\n" +
    "                    <div class=\"buttons\">\r" +
    "\n" +
    "                        <div ng-show=\"buttons\" ng-include=\"buttons\"></div>\r" +
    "\n" +
    "                        <button type=\"button\" ng-show=\"!published && !draft\" class=\"btn btn-danger\" ng-click=\"discard()\">discard</button>\r" +
    "\n" +
    "                        <button type=\"button\" ng-disabled=\"published && !draft\" class=\"btn btn-success\" ng-click=\"publish()\">publish</button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <ctrl-language-selector class=\"language-selector\" ng-model=\"language\" ng-options=\"application.languages\" ng-show=\"localized && localization\"></ctrl-language-selector>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-show=\"found === true\" class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-10 scrollspy-container\" data-scrollspy>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"row title-container\">\r" +
    "\n" +
    "            <div class=\"col-sm-12\">\r" +
    "\n" +
    "                <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "                <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-title\" data-scrollspy=\"title\" ng-show=\"list.properties.title\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-text class=\" col-sm-12\" ng-model=\"model.title[language]\" ng-validating=\"active[language]\" ng-disabled=\"!list.properties.title\" ng-required=\"true\" ng-label=\"title\"></ctrl-text>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-show=\"template\" ng-include=\"template\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"col-md-2\">\r" +
    "\n" +
    "        <ctrl-scroll-spy ng-model=\"nav\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-if=\"found === false\" class=\"container error-page\" ng-include=\"'tmpl/core/common/404.html'\"></div>"
  );


  $templateCache.put('admin/tmpl/core/base/form.html',
    "<div ng-show=\"found === true\" class=\"container-fluid affix-area form-buttons-container\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row \">\r" +
    "\n" +
    "            <div class=\"col-md-10\">\r" +
    "\n" +
    "                <div class=\"affix-container\">\r" +
    "\n" +
    "                    <div class=\"buttons\">\r" +
    "\n" +
    "                        <div ng-show=\"buttons\" ng-include=\"buttons\"></div>\r" +
    "\n" +
    "                        <button type=\"button\" ng-show=\"!published && !draft\" class=\"btn btn-danger\" ng-click=\"discard()\">discard</button>\r" +
    "\n" +
    "                        <button type=\"button\" ng-disabled=\"published && !draft\" class=\"btn btn-success\" ng-click=\"publish()\">publish</button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <ctrl-language-selector class=\"language-selector\" ng-model=\"language\" ng-options=\"application.languages\" ng-show=\"localized && localization\"></ctrl-language-selector>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-show=\"found === true\" class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-10 scrollspy-container\" data-scrollspy>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-include=\"template\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"col-md-2\">\r" +
    "\n" +
    "        <ctrl-scroll-spy ng-model=\"nav\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-if=\"found === false\" class=\"container error-page\" ng-include=\"'tmpl/core/common/404.html'\"></div>"
  );


  $templateCache.put('admin/tmpl/core/base/list.html',
    "<div ng-show=\"found === true\" class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-include=\"template\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-if=\"found === false\" class=\"container error-page\" ng-include=\"'tmpl/core/common/404.html'\"></div>"
  );


  $templateCache.put('admin/tmpl/core/base/modals/confirm.html',
    "<div class=\"modal-confirmation\">\r" +
    "\n" +
    "    <span class=\"confirm-message\" ng-bind-html=\"message\"></span>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/base/modals/form.html',
    "<div class=\"modal-form\">\r" +
    "\n" +
    "    \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/base/modals/prompt.html',
    "<div class=\"modal-prompt\">\r" +
    "\n" +
    "    <span class=\"error-message\" ng-bind-html=\"message\"></span>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/base/modals/selector.html',
    "<div class=\"data-select\">\r" +
    "\n" +
    "    <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-selectable=\"true\" ng-select-mode=\"mode\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "        <ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "        </ctrl-grid-header>\r" +
    "\n" +
    "        <ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "            <ctrl-grid-empty>no data</ctrl-grid-empty>\r" +
    "\n" +
    "        </ctrl-grid-footer>\r" +
    "\n" +
    "        <ctrl-grid-body>\r" +
    "\n" +
    "            <ctrl-grid-column>\r" +
    "\n" +
    "                {{ model.title[language] }}\r" +
    "\n" +
    "            </ctrl-grid-column>\r" +
    "\n" +
    "        </ctrl-grid-body>\r" +
    "\n" +
    "    </ctrl-grid>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/base/modals/upload.html',
    "<div class=\"modal-upload container-fluid file-upload\" flow-prevent-drop>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\" flow-init=\"{target: '/jsnbt-upload?path=' + path}\" flow-file-added=\"validate($file)\" flow-files-submitted=\"$flow.upload()\" flow-drag-enter=\"dropClass='drag-over'\" flow-drag-leave=\"dropClass=''\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"drop\" flow-drop ng-class=\"dropClass\">\r" +
    "\n" +
    "            drag and drop any files here\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"contents\">\r" +
    "\n" +
    "            <div ng-repeat=\"error in errors\" class=\"transfer-box\">\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <div class=\"col-md-11\">\r" +
    "\n" +
    "                        <div class=\"progress progress-striped upload-error\">\r" +
    "\n" +
    "                            <div class=\"progress-bar\" role=\"progressbar\"\r" +
    "\n" +
    "                                 aria-valuenow=\"0\"\r" +
    "\n" +
    "                                 aria-valuemin=\"0\"\r" +
    "\n" +
    "                                 aria-valuemax=\"100\"\r" +
    "\n" +
    "                                 ng-style=\"{width: '100%'}\">\r" +
    "\n" +
    "                                {{error.file.name}} : {{error.error}}\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col-md-1\">\r" +
    "\n" +
    "                        <button title=\"Delete\" class=\"btn btn-default btn-sm glyphicon glyphicon-remove\" ng-click=\"error.delete()\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-repeat=\"file in $flow.files\" class=\"transfer-box\">\r" +
    "\n" +
    "                <div class=\"row\">\r" +
    "\n" +
    "                    <div class=\"col-md-11\">\r" +
    "\n" +
    "                        <div class=\"progress progress-striped\" ng-class=\"{active: file.isUploading()}\">\r" +
    "\n" +
    "                            <div class=\"progress-bar\" role=\"progressbar\"\r" +
    "\n" +
    "                                 aria-valuenow=\"{{file.progress() * 100}}\"\r" +
    "\n" +
    "                                 aria-valuemin=\"0\"\r" +
    "\n" +
    "                                 aria-valuemax=\"100\"\r" +
    "\n" +
    "                                 ng-style=\"{width: (file.progress() * 100) + '%'}\">\r" +
    "\n" +
    "                                {{file.relativePath}} ({{file.size}} bytes)\r" +
    "\n" +
    "                                <span class=\"sr-only\">{{file.progress()}}% Complete</span>\r" +
    "\n" +
    "                            </div>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"col-md-1\">\r" +
    "\n" +
    "                        <button title=\"Delete\" class=\"btn btn-default btn-sm glyphicon glyphicon-remove\" ng-click=\"file.cancel()\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/base/nodeForm.html',
    "<div ng-show=\"found === true\" class=\"container-fluid affix-area form-buttons-container\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row \">\r" +
    "\n" +
    "            <div class=\"col-md-10\">\r" +
    "\n" +
    "                <div class=\"affix-container\">\r" +
    "\n" +
    "                    <div class=\"buttons\">\r" +
    "\n" +
    "                        <div ng-show=\"buttons\" ng-include=\"buttons\"></div>\r" +
    "\n" +
    "                        <button type=\"button\" ng-show=\"!published && !draft\" class=\"btn btn-danger\" ng-click=\"discard()\">discard</button>\r" +
    "\n" +
    "                        <button type=\"button\" ng-disabled=\"published && !draft\" class=\"btn btn-success\" ng-click=\"publish()\">publish</button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <ctrl-language-selector class=\"language-selector\" ng-model=\"language\" ng-options=\"application.languages\" ng-show=\"localized && localization\"></ctrl-language-selector>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-show=\"found === true\" class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-10 scrollspy-container\" data-scrollspy>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"row title-container\">\r" +
    "\n" +
    "            <div class=\"col-sm-12\">\r" +
    "\n" +
    "                <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "                <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-title\" data-scrollspy=\"title\" ng-show=\"entity.properties.title || entity.properties.active\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-text class=\"col-sm-10\" ng-model=\"model.title[language]\" ng-validating=\"model.active[language] || language === defaults.language\" ng-disabled=\"!entity.properties.title\" ng-required=\"true\" ng-auto-focus=\"true\" ng-label=\"title\"></ctrl-text>\r" +
    "\n" +
    "                <ctrl-check class=\"col-sm-2\" ng-model=\"model.active[language]\" ng-show=\"entity.properties.active\" ng-disabled=\"!entity.properties.active\" ng-label=\"active\"></ctrl-check>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-parent\" data-scrollspy=\"parent\" ng-show=\"entity.properties.parent\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-node class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"model.parent\" ng-domain=\"model.domain\" ng-entities=\"parentOptions.entities\" ng-disabled=\"!entity.properties.parent\" ng-required=\"false\" ng-options=\"parentOptions\" ng-label=\"parent\" ng-tip=\"leave blank for root\">\r" +
    "\n" +
    "                    {{model.title[language]}}\r" +
    "\n" +
    "                </ctrl-node>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-type\" ng-show=\"model.domain === 'core' && entities.length &gt; 1\" data-scrollspy=\"type\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-select class=\"col-sm-12\" ng-model=\"model.entity\" ng-required=\"true\" ng-label=\"type\" ng-options=\"entities\" ng-disabled=\"model.domain !== 'core'\"></ctrl-select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-seo\" data-scrollspy=\"seo\" ng-show=\"entity.properties.seo\">\r" +
    "\n" +
    "            <div class=\"row breadcrumb-form-row\">\r" +
    "\n" +
    "                <div class=\"col-sm-12\" ng-show=\"entity.properties.seo\">\r" +
    "\n" +
    "                    <label for=\"txtSeoName\">seo</label>\r" +
    "\n" +
    "                    <ol class=\"breadcrumb\">\r" +
    "\n" +
    "                        <li ng-repeat=\"item in seoNames\"><span>{{item[language]}}</span></li>\r" +
    "\n" +
    "                        <li class=\"active\">\r" +
    "\n" +
    "                            <ctrl-text ng-model=\"model.seo[language]\" ng-required=\"true\" ng-validating=\"model.active[language]\" ng-disabled=\"!entity.properties.seo\" ng-validate=\"validateSeo\" ng-valid=\"validation.seo\" ng-characters=\"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_\"></ctrl-text>\r" +
    "\n" +
    "                            <span ng-show=\"!validation.seo && model.active[language] && entity.properties.seo\">(name is taken)</span>\r" +
    "\n" +
    "                        </li>\r" +
    "\n" +
    "                    </ol>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-addon\" data-scrollspy=\"addon\" ng-show=\"model.entity === 'pointer'\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-select class=\"col-sm-6\" ng-model=\"model.pointer.domain\" ng-required=\"true\" ng-disabled=\"model.entity !== 'pointer'\" ng-label=\"addon\" ng-default=\"true\" ng-options=\"modules\" ng-name-field=\"name\" ng-value-field=\"domain\"></ctrl-select>\r" +
    "\n" +
    "                <ctrl-node class=\"col-sm-5\" ng-language=\"defaults.language\" ng-model=\"model.pointer.nodeId\" ng-domain=\"model.pointer.domain\" ng-required=\"model.pointer.domain && model.entity === 'pointer'\" ng-disabled=\"model.entity !== 'pointer'\" ng-options=\"{ pointee: true }\" ng-label=\"pointee\">\r" +
    "\n" +
    "                    {{model.title[language]}}\r" +
    "\n" +
    "                </ctrl-node>\r" +
    "\n" +
    "                <div class=\"col-sm-1\">\r" +
    "\n" +
    "                    <button type=\"button\" ng-disabled=\"!model.pointer.domain || !model.pointer.nodeId\" class=\"btn\" ng-click=\"editPointee()\" style=\"position: relative; top: 25px\">edit</button>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-route\" data-scrollspy=\"route\" ng-show=\"model.entity === 'router'\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-select class=\"col-sm-12\" ng-model=\"model.route\" ng-required=\"true\" ng-disabled=\"model.entity !== 'router'\" ng-label=\"route\" ng-default=\"true\" ng-options=\"routes\" ng-name-field=\"name\" ng-value-field=\"id\"></ctrl-select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-layouts\" data-scrollspy=\"layouts\" ng-show=\"entity.properties.layouts\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-select-list class=\"col-sm-10\" ng-model=\"values.layouts\" ng-disabled=\"!entity.properties.layouts || model.layouts.inherits\" ng-required=\"true\" ng-options=\"layouts\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"layouts\"></ctrl-select-list>\r" +
    "\n" +
    "                <ctrl-check class=\"col-sm-2\" ng-model=\"model.layouts.inherits\" ng-disabled=\"!entity.properties.layouts\" ng-label=\"inheritance\"></ctrl-check>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-content\" data-scrollspy=\"content\" ng-show=\"model.entity !== 'pointer'\">\r" +
    "\n" +
    "            <div class=\"row\" id=\"page-template\" data-scrollspy=\"template\" ng-show=\"entity.properties.template\">\r" +
    "\n" +
    "                <ctrl-select class=\"col-sm-12\" ng-model=\"model.template\" ng-disabled=\"!entity.properties.template\" ng-required=\"true\" ng-options=\"templates[model.entity]\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"template\"></ctrl-select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr ng-show=\"entity.properties.template\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-include=\"template\"></div>\r" +
    "\n" +
    "            <hr ng-show=\"template\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-show=\"form\" ng-include=\"form\"></div>\r" +
    "\n" +
    "            <hr ng-show=\"form\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-meta\" data-scrollspy=\"meta\" ng-show=\"entity.properties.meta\">\r" +
    "\n" +
    "            <div id=\"page-meta-title\" class=\"row\" data-scrollspy=\"title\">\r" +
    "\n" +
    "                <ctrl-text class=\"col-sm-12\" ng-model=\"model.meta[language].title\" ng-required=\"true\" ng-validating=\"model.active[language]\" ng-disabled=\"!entity.properties.meta\" ng-label=\"meta title\"></ctrl-text>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"page-meta-description\" class=\"row\" data-scrollspy=\"description\">\r" +
    "\n" +
    "                <ctrl-text-area class=\"col-sm-12\" ng-rows=\"4\" ng-model=\"model.meta[language].description\" ng-required=\"false\" ng-validating=\"model.active[language]\" ng-disabled=\"!entity.properties.meta\" ng-label=\"meta description\"></ctrl-text-area>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div id=\"page-meta-keywords\" class=\"row\" data-scrollspy=\"keywords\">\r" +
    "\n" +
    "                <ctrl-tags class=\"col-sm-12\" ng-model=\"model.meta[language].keywords\" ng-placeholder=\"add a keyword\" ng-required=\"false\" ng-validating=\"model.active[language]\" ng-disabled=\"!entity.properties.meta\" ng-label=\"meta keywords\"></ctrl-tags>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-robots\" data-scrollspy=\"robots\" ng-show=\"entity.properties.robots\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-check-list class=\"col-sm-10\" ng-model=\"values.robots\" ng-options=\"robots\" ng-required=\"true\" ng-disabled=\"!entity.properties.robots || model.robots.inherits\" ng-label=\"robots\"></ctrl-check-list>\r" +
    "\n" +
    "                <ctrl-check class=\"col-sm-2\" ng-model=\"model.robots.inherits\" ng-disabled=\"!entity.properties.robots\" ng-label=\"inheritance\"></ctrl-check>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-permissions\" data-scrollspy=\"permissions\" ng-show=\"entity.properties.permissions\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-check-list class=\"col-sm-10\" ng-model=\"values.roles\" ng-options=\"roles\" ng-required=\"true\" ng-disabled=\"!entity.properties.permissions || model.roles.inherits\" ng-label=\"permissions\"></ctrl-check-list>\r" +
    "\n" +
    "                <ctrl-check class=\"col-sm-2\" ng-model=\"model.roles.inherits\" ng-disabled=\"!entity.properties.permissions\" ng-label=\"inheritance\"></ctrl-check>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div id=\"page-ssl\" data-scrollspy=\"ssl\" ng-show=\"application.ssl && entity.properties.ssl\">\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <ctrl-check class=\"col-sm-10\" ng-model=\"values.secure\" ng-disabled=\"!application.ssl || !entity.properties.ssl || model.secure.inherits\" ng-label=\"ssl\"></ctrl-check>\r" +
    "\n" +
    "                <ctrl-check class=\"col-sm-2\" ng-model=\"model.secure.inherits\" ng-disabled=\"!application.ssl || !entity.properties.ssl\" ng-label=\"inheritance\"></ctrl-check>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"col-md-2\">\r" +
    "\n" +
    "        <ctrl-scroll-spy ng-model=\"nav\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-if=\"found === false\" class=\"container error-page\" ng-include=\"'tmpl/core/common/404.html'\"></div>"
  );


  $templateCache.put('admin/tmpl/core/base/settings.html',
    "<div class=\"container-fluid affix-area form-buttons-container\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row \">\r" +
    "\n" +
    "            <div class=\"col-md-10\">\r" +
    "\n" +
    "                <div class=\"affix-container\">\r" +
    "\n" +
    "                    <div class=\"buttons\">\r" +
    "\n" +
    "                        <button type=\"button\" ng-show=\"!published && !draft\" class=\"btn btn-danger\" ng-click=\"discard()\">discard</button>\r" +
    "\n" +
    "                        <button type=\"button\" ng-disabled=\"published && !draft\" class=\"btn btn-success\" ng-click=\"publish()\">save</button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-10 scrollspy-container\" data-scrollspy>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-include=\"template\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"col-md-2\">\r" +
    "\n" +
    "        <ctrl-scroll-spy ng-model=\"nav\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('admin/tmpl/core/base/tree.html',
    "<div ng-show=\"found === true\" class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <section class=\"col-md-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ctrl-breadcrumb ng-show=\"breadcrumb\" ng-model=\"current.breadcrumb.items\" ng-title=\"current.breadcrumb.title\"></ctrl-breadcrumb>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-include=\"template\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </section>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-if=\"found === false\" class=\"container error-page\" ng-include=\"'tmpl/core/common/404.html'\"></div>"
  );


  $templateCache.put('admin/tmpl/core/common/404.html',
    "<div class=\"not-found-dialog\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <h3 class=\"not-found-text-title\">404</h3>\r" +
    "\n" +
    "        <span class=\"not-found-text-subtitle text-info\">the requested page was not found</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/common/denied.html',
    "<div class=\"denied-dialog\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <h3 class=\"denied-text-title text-danger\">access denied</h3>\r" +
    "\n" +
    "        <span class=\"denied-text-subtitle text-warning\">access is prohibited for this specific section of jsnbt</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/common/first-user.html',
    "<div class=\"first-user-dialog\">\r" +
    "\n" +
    "    <div class=\"first-user-dialog-container\">\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <div class=\"row title-container\">\r" +
    "\n" +
    "                    <div class=\"col-md-12\">\r" +
    "\n" +
    "                        <h1>first time here?</h1>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <pnl-registration ng-roles=\"['sa']\"></pnl-registration>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/common/header.html',
    "<div class=\"navbar navbar-fixed-top\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"pull-left\">\r" +
    "\n" +
    "            <h1 class=\"head-line\"><img ng-if=\"application.name.image\" ng-src=\"{{application.name.image}}\" /><small ng-if=\"application.name.title\">{{application.name.title}}</small></h1>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"pull-right account-options\">\r" +
    "\n" +
    "            <popover class=\"user-button glyphicon glyphicon-user\">\r" +
    "\n" +
    "                <div class=\"user-info-box\">\r" +
    "\n" +
    "                    <img class=\"gravatar\" ng-src=\"{{ 'http://www.gravatar.com/avatar/' + (current.user.username | gravatar) }}\" />\r" +
    "\n" +
    "                    <div class=\"account-info\">\r" +
    "\n" +
    "                        <span class=\"user-name\">{{ current.user.firstName }} {{ current.user.lastName }}</span>\r" +
    "\n" +
    "                        <span class=\"user-username\">{{ current.user.username }}</span>\r" +
    "\n" +
    "                        \r" +
    "\n" +
    "                        <button class=\"btn btn-primary account-button\" ng-click=\"goto('/account')\">account</button>                        \r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </popover>\r" +
    "\n" +
    "            <span class=\"user-button glyphicon glyphicon-off\" ng-click=\"current.logout()\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <nav class=\"navbar navbar-default\" role=\"navigation\">\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <div class=\"navbar-header\">\r" +
    "\n" +
    "                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\r" +
    "\n" +
    "                    <span class=\"sr-only\">Toggle navigation</span>\r" +
    "\n" +
    "                    <span class=\"icon-bar\"></span>\r" +
    "\n" +
    "                    <span class=\"icon-bar\"></span>\r" +
    "\n" +
    "                    <span class=\"icon-bar\"></span>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\r" +
    "\n" +
    "                <ul class=\"nav navbar-nav\">\r" +
    "\n" +
    "                    <li ng-repeat=\"menuItem in application.navigationSpec | filter: {index: 0}\" ng-class=\"{'active': current.breadcrumb.items[0].name === menuItem.identifier}\"><a href=\"javascript:;\" ng-click=\"goto(menuItem.url)\">{{ menuItem.name }}</a></li>\r" +
    "\n" +
    "                    <li ng-class=\"{'active': current.breadcrumb.items.length === 0 || current.breadcrumb.items[0].name === 'dashboard' }\"><a href=\"javascript:;\" ng-click=\"goto('/dashboard')\">dashboard</a></li>\r" +
    "\n" +
    "                    <li ng-repeat=\"menuItem in application.navigationSpec | filter: {index: 1}\" ng-class=\"{'active': current.breadcrumb.items[0].name === menuItem.identifier}\"><a href=\"javascript:;\" ng-click=\"goto(menuItem.url)\">{{ menuItem.name }}</a></li>\r" +
    "\n" +
    "                    <li ng-class=\"{'active': current.breadcrumb.items[0].name === 'content'}\"><a href=\"javascript:;\" ng-click=\"goto('/content')\">content</a></li>\r" +
    "\n" +
    "                    <li ng-repeat=\"menuItem in application.navigationSpec | filter: {index: 2}\" ng-class=\"{'active': current.breadcrumb.items[0].name === menuItem.identifier}\"><a href=\"javascript:;\" ng-click=\"goto(menuItem.url)\">{{ menuItem.name }}</a></li>\r" +
    "\n" +
    "                    <li ng-class=\"{'active': current.breadcrumb.items[0].name === 'modules'}\"><a href=\"javascript:;\" ng-click=\"goto('/modules')\">modules</a></li>\r" +
    "\n" +
    "                    <li ng-repeat=\"menuItem in application.navigationSpec | filter: {index: 3}\" ng-class=\"{'active': current.breadcrumb.items[0].name === menuItem.identifier}\"><a href=\"javascript:;\" ng-click=\"goto(menuItem.url)\">{{ menuItem.name }}</a></li>\r" +
    "\n" +
    "                    <li ng-class=\"{'active': current.breadcrumb.items[0].name === 'users'}\" ng-show=\"isAuthorized('users')\"><a href=\"javascript:;\" ng-click=\"goto('/users')\">users</a></li>\r" +
    "\n" +
    "                    <li ng-repeat=\"menuItem in application.navigationSpec | filter: {index: 4}\" ng-class=\"{'active': current.breadcrumb.items[0].name === menuItem.identifier}\"><a href=\"javascript:;\" ng-click=\"goto(menuItem.url)\">{{ menuItem.name }}</a></li>\r" +
    "\n" +
    "                    <li ng-class=\"{'active': current.breadcrumb.items[0].name === 'settings'}\" ng-show=\"isAuthorized('settings')\"><a href=\"javascript:;\" ng-click=\"goto('/settings')\">settings</a></li>\r" +
    "\n" +
    "                    <li ng-repeat=\"menuItem in application.navigationSpec | filter: {index: 5}\" ng-class=\"{'active': current.breadcrumb.items[0].name === menuItem.identifier}\"><a href=\"javascript:;\" ng-click=\"goto(menuItem.url)\">{{ menuItem.name }}</a></li>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </nav>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/common/login.html',
    "<div class=\"login-dialog\">\r" +
    "\n" +
    "    <div class=\"login-dialog-container\">\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <div class=\"row title-container\">\r" +
    "\n" +
    "                    <div class=\"col-md-12\">\r" +
    "\n" +
    "                        <h1>login</h1>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <pnl-login></pnl-login>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/common/modal.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <button type=\"button\" class=\"bootbox-close-button close\" ng-click=\"cancel()\">×</button>\r" +
    "\n" +
    "    <h4 class=\"modal-title\">{{modal.title}}</h4>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "    <div class=\"bootbox-body\" ng-include=\"modal.template\"></div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-show=\"btn.cancel\" ng-click=\"cancel()\">{{ btn.cancel }}</button>\r" +
    "\n" +
    "    <button type=\"button\" class=\"btn btn-primary\" ng-show=\"btn.ok\" ng-click=\"ok()\">{{ btn.ok }}</button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/ctrlBreadcrumb.html',
    "<div>\r" +
    "\n" +
    "    <span ng-show=\"ngTitle\" class=\"guide\">{{ngTitle}} </span>\r" +
    "\n" +
    "    <ol class=\"breadcrumb\">\r" +
    "\n" +
    "        <li ng-repeat=\"item in ngModel | filter:visible\">\r" +
    "\n" +
    "            <a ng-if=\"!item.active\" data-url=\"{{item.url}}\" href=\"javascript:;\" ng-click=\"previousTo(item.url)\">{{item.name}}</a>\r" +
    "\n" +
    "            <span ng-if=\"item.active\" data-url=\"{{item.url}}\" class=\"active\">{{item.name}}</span>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ol>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/ctrlExplorer.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"breadcrumb\">\r" +
    "\n" +
    "        <span class=\"guide\">path: </span>\r" +
    "\n" +
    "        <ul>\r" +
    "\n" +
    "            <li ng-repeat=\"item in breadcrumb\"><a href=\"javascript:;\" ng-click=\"open(item.url)\" ng-class=\"{ active: item.active }\">{{item.name}}</a></li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row explorer-controls\" ng-show=\"!ngSelectable\">\r" +
    "\n" +
    "        <div class=\"col-sm-6\">\r" +
    "\n" +
    "            <label class=\"control-label\">new folder</label>\r" +
    "\n" +
    "            <div class=\"input-group\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"new\" data-input=\"create\" data-allowed-chars=\"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_ ()#$%\">\r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"create()\">create</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-sm-6\">\r" +
    "\n" +
    "            <label class=\"control-label\">new file</label>\r" +
    "\n" +
    "            <div class=\"input-group\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" disabled=\"disabled\">\r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"upload()\">upload</button>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <table class=\"table table-condensed explorer-files\">\r" +
    "\n" +
    "        <tr ng-repeat=\"item in contents\" ng-class=\"{'ng-selected': selected[item.location]}\">\r" +
    "\n" +
    "            <td class=\"image\" ng-click=\"select(item)\" ng-dblclick=\"open(item)\">\r" +
    "\n" +
    "                <img ng-src=\"{{ item.icon === 'image' ? '../' + item.location + '?type=admin-explorer-thumb' : 'img/core/explorer/icon/' + item.icon + '.png' }}\" />\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "            <td class=\"main\" ng-click=\"select(item)\" ng-dblclick=\"open(item)\">\r" +
    "\n" +
    "                <div class=\"name\">{{item.name}}</div>\r" +
    "\n" +
    "                <div class=\"size\" ng-show=\"item.type === 'file'\">{{item.size}} kb</div>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "            <td class=\"buttons\" ng-show=\"!ngSelectable\">\r" +
    "\n" +
    "                <button title=\"edit\" class=\"btn btn-default btn-sm glyphicon glyphicon-edit\" ng-click=\"edit(item)\"></button>\r" +
    "\n" +
    "                <button title=\"delete\" class=\"btn btn-default btn-sm glyphicon glyphicon-remove\" ng-click=\"delete(item)\"></button>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "            <td class=\"buttons\" style=\"width:20px;\"></td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/ctrlImageCropper.html',
    "<div>\r" +
    "\n" +
    "    <img ng-src=\"{{'../'+ngModel.src}}\" />\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/ctrlLanguageSelector.html',
    "<div>\r" +
    "\n" +
    "    <a class=\"selected-locale\" href=\"javascript:;\" ng-click=\"onClick($event)\">\r" +
    "\n" +
    "        <img ng-if=\"optionCodes[ngModel][imageField]\" ng-src=\"{{optionCodes[ngModel][imageField]}}\" /> {{optionCodes[ngModel][textField]}}\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <div class=\"language-container-scrollable\" data-ng-show=\"opened\">\r" +
    "\n" +
    "        <table class=\"language-container\">\r" +
    "\n" +
    "            <tbody>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <ul>\r" +
    "\n" +
    "                            <li ng-repeat=\"option in ngOptions\">\r" +
    "\n" +
    "                                <a href=\"javascript:;\" title=\"{{option[textField]}}\" ng-click=\"select(option)\" ng-class=\"option[valueField] == ngModel ? 'selected-locale' : ''\">\r" +
    "\n" +
    "                                    <img ng-if=\"option[imageField]\" ng-src=\"{{option[imageField]}}\" />\r" +
    "\n" +
    "                                    {{option[textField]}}\r" +
    "\n" +
    "                                </a>\r" +
    "\n" +
    "                            </li>\r" +
    "\n" +
    "                        </ul>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "            </tbody>\r" +
    "\n" +
    "        </table>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('admin/tmpl/core/controls/ctrlScrollSpy.html',
    "<div class=\"bs-sidebar bs-docs-sidebar affix\" role=\"complementary\">\r" +
    "\n" +
    "    <ul class=\"nav\">\r" +
    "\n" +
    "        <li ng-repeat=\"node in ngModel\" data-target=\"{{node.target}}\">\r" +
    "\n" +
    "            <a href=\"{{node.target}}\">{{node.name}}</a>\r" +
    "\n" +
    "            <ul class=\"nav\" ng-show=\"node.children.length !== 0\">\r" +
    "\n" +
    "                <li ng-repeat=\"child in node.children\" data-target=\"{{child.target}}\">\r" +
    "\n" +
    "                    <a href=\"{{child.target}}\">{{child.name}}</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlCheck.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <input type=\"checkbox\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlCheckList.html',
    "<div ng-class=\"{ invalid: enabled && !valid, empty: empty }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': enabled && !valid, 'has-feedback': enabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ ngLabel }}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <div class=\"check-options\">\r" +
    "\n" +
    "                <div class=\"check-option\" ng-repeat=\"option in ngOptions\">\r" +
    "\n" +
    "                    <label class=\"check-option-title\">{{ option[nameField] }}</label>\r" +
    "\n" +
    "                    <input class=\"check-option-control\" type=\"checkbox\" id=\"chk{{ id }}{{ option[valueField] }}\" />\r" +
    "\n" +
    "                    <span class=\"check-option-description\">{{ option[descriptionField] }}</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <span ng-show=\"enabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlContainer.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"data{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"input-group form-control-feedback-container\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"data{{id}}\" value=\"{{ wrong ? (missing ? '-- not found -- (' + value + ')' : '-- invalid value --') : value }}\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong ? (missing ? 'not found' : 'invalid value') : 'value is required' }}\"></span>\r" +
    "\n" +
    "            <div class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"select()\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-show=\"!ngRequired\" ng-click=\"clear()\" ng-disabled=\"ngDisabled || !ngModel\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlContainerList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-container-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"value\">\r" +
    "\n" +
    "            <li ng-repeat=\"item in value track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <input type=\"text\" class=\"form-control\" value=\"{{ wrong[$index] ? (missing[$index] ? '-- not found -- (' + item.id + ')' : '-- invalid value --') : item.name }}\" disabled=\"disabled\" />\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong[$index] ? (missing[$index] ? 'not found' : 'invalid value') : '' }}\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"select\" class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"edit($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || value.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlCustom.html',
    "<div class=\"form-group\">\r" +
    "\n" +
    "    <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "    <div lk-repeat=\"model in value track by $index\" class=\"form-control-feedback-container\" id=\"cstm{{id}}\"><div class=\"form-control form-control-li-container\" ng-transclude></div></div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlCustomList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-custom-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"ngModel\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <li lk-repeat=\"model in ngModel track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <div class=\"form-control form-control-li-container\" ng-transclude></div>\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-remove form-control-feedback\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"form-control\" id=\"cstm{{id}}new\" disabled=\"disabled\"></div>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || ngModel.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlData.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"data{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"input-group form-control-feedback-container\">\r" +
    "\n" +
    "            <span class=\"form-control\" id=\"node{{id}}\" disabled=\"disabled\">\r" +
    "\n" +
    "                {{ wrong ? (missing ? '-- not found -- (' + value + ')' : '-- invalid value --') : '' }}\r" +
    "\n" +
    "                <span ng-show=\"!wrong && !missing\" class=\"transcluded\"></span>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong ? (missing ? 'not found' : 'invalid value') : 'value is required' }}\"></span>\r" +
    "\n" +
    "            <div class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"select()\" ng-disabled=\"ngDisabled || !ngDomain\"></button>\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-show=\"!ngRequired\" ng-click=\"clear()\" ng-disabled=\"ngDisabled || !ngModel\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlDataList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-data-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"value\">\r" +
    "\n" +
    "            <li ng-repeat=\"model in value track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <span class=\"form-control\" id=\"node{{id}}\" disabled=\"disabled\">\r" +
    "\n" +
    "                        {{ wrong[$index] ? (missing[$index] ? '-- not found -- (' + model.id + ')' : '-- invalid value --') : '' }}\r" +
    "\n" +
    "                        <span ng-show=\"!wrong[$index] && !missing[$index]\" class=\"transcluded\" ng-model-transclude></span>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong[$index] ? (missing[$index] ? 'not found' : 'invalid value') : '' }}\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"select\" class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"edit($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || !ngDomain || !ngListId || value.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlDatePicker.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"txt{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <div class=\"input-group\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"model\" ng-blur=\"leftInput($event)\" />\r" +
    "\n" +
    "                <div class=\"input-group-btn\">\r" +
    "\n" +
    "                    <button class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"select()\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear()\" ng-show=\"!ngRequired\" ng-disabled=\"ngDisabled || !model\"></button>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>  \r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlFile.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"file{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"input-group form-control-feedback-container\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"file{{id}}\" value=\"{{ wrong ? '-- invalid value --' : value }}\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong ? 'invalid value' : 'value is required' }}\"></span>\r" +
    "\n" +
    "            <div class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"select()\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-show=\"!ngRequired\" ng-click=\"clear()\" ng-disabled=\"ngDisabled || !ngModel\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlFileList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-file-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"value\">\r" +
    "\n" +
    "            <li ng-repeat=\"item in value track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <input type=\"text\" class=\"form-control\" value=\"{{ wrong[$index] ? '-- invalid value --' : item }}\" disabled=\"disabled\" />\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong[$index] ? 'invalid value' : 'value is required' }}\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"select\" class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"edit($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || value.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlHtml.html',
    "<div ng-class=\"{ invalid: enabled && !valid, 'redactor-disabled': !enabled }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': enabled && !valid, 'has-feedback': enabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <textarea id=\"editor_{{ id }}\" class=\"form-control\" cols=\"30\" rows=\"10\"></textarea>\r" +
    "\n" +
    "            <span ng-show=\"enabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlImage.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"input-group form-control-feedback-container\">\r" +
    "\n" +
    "            <div class=\"form-control\">\r" +
    "\n" +
    "                <img err-src=\"../admin/img/core/noimage.jpg\" ng-src=\"../{{value != '' ? value : 'admin/img/core/noimage.jpg' }}?type=admin-image-thumb\" />\r" +
    "\n" +
    "                <span>{{ wrong ? '-- invalid value --' : value }}</span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong ? 'invalid value' : 'value is required' }}\"></span>\r" +
    "\n" +
    "            <div class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"edit()\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-picture\" type=\"button\" ng-click=\"crop()\" ng-disabled=\"ngDisabled || wrong || !ngModel.src\"></button>\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-show=\"!ngRequired\" ng-click=\"clear()\" ng-disabled=\"ngDisabled || !ngModel\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlImageList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-image-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"value\">\r" +
    "\n" +
    "            <li ng-repeat=\"item in value track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <div class=\"form-control\">\r" +
    "\n" +
    "                        <img err-src=\"../admin/img/core/noimage.jpg\" ng-src=\"../{{ wrong[$index] ? 'admin/img/core/noimage.jpg' : (item.src != '' ? item.src : 'admin/img/core/noimage.jpg') }}?type=admin-image-thumb\" />\r" +
    "\n" +
    "                        <span>{{ wrong[$index] ? '-- invalid value --' : item.src }}</span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong[$index] ? 'invalid value' : 'value is required' }}\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"select\" class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"edit($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                        <button title=\"crop\" class=\"btn btn-default glyphicon glyphicon-picture\" type=\"button\" ng-click=\"crop($index)\" ng-disabled=\"ngDisabled || wrong[$index] || !item.src\"></button>\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || value.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlMap.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"row coordinates-container\">\r" +
    "\n" +
    "            <div class=\"col-sm-6 form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && coordinates.longitude === '', 'has-feedback': !ngDisabled && !valid && coordinates.longitude === '' }\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-disabled=\"ngDisabled\" ng-class=\"{ 'coordinates-invalid': !ngDisabled && !valid && coordinates.longitude === '' }\" ng-model=\"coordinates.longitude\" ng-change=\"changed()\" placeholder=\"longitude\" ng-keypress=\"preventInvalidCharaters($event)\" />\r" +
    "\n" +
    "                <span ng-show=\"!ngDisabled && !valid && coordinates.longitude === ''\" tooltip=\"value is required\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"col-sm-6 form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && coordinates.latitude === '', 'has-feedback': !ngDisabled && !valid.latitude === '' }\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-disabled=\"ngDisabled\" ng-class=\"{ 'coordinates-invalid': !ngDisabled && !valid && coordinates.latitude === '' }\" ng-model=\"coordinates.latitude\" ng-change=\"changed()\" placeholder=\"latitude\" ng-keypress=\"preventInvalidCharaters($event)\" />\r" +
    "\n" +
    "                <span ng-show=\"!ngDisabled && !valid && coordinates.latitude === ''\" tooltip=\"value is required\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"map-container\" ng-class=\"{ 'map-disabled': ngDisabled }\">\r" +
    "\n" +
    "            <div id=\"map{{id}}\" class=\"form-map\" ng-style=\"{ 'height': height }\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlNode.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"node{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"input-group form-control-feedback-container\">\r" +
    "\n" +
    "            <span class=\"form-control\" id=\"node{{id}}\" disabled=\"disabled\">\r" +
    "\n" +
    "                {{ wrong ? (missing ? '-- not found -- (' + value + ')' : '-- invalid value --') : '' }}\r" +
    "\n" +
    "                <span ng-show=\"!wrong && !missing\" class=\"transcluded\"></span>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong ? (missing ? 'not found' : 'invalid value') : 'value is required' }}\"></span>\r" +
    "\n" +
    "            <div class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"select()\" ng-disabled=\"ngDisabled || !ngDomain\"></button>\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-show=\"!ngRequired\" ng-click=\"clear()\" ng-disabled=\"ngDisabled || !ngModel\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlNodeList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-node-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"value\">\r" +
    "\n" +
    "            <li ng-repeat=\"model in value track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <span class=\"form-control\" id=\"node{{id}}\" disabled=\"disabled\">\r" +
    "\n" +
    "                        {{ wrong[$index] ? (missing[$index] ? '-- not found -- (' + model.id + ')' : '-- invalid value --') : '' }}\r" +
    "\n" +
    "                        <span ng-show=\"!wrong[$index] && !missing[$index]\" class=\"transcluded\" ng-model-transclude></span>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ wrong[$index] ? (missing[$index] ? 'not found' : 'invalid value') : '' }}\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"select\" class=\"btn btn-default glyphicon glyphicon-th\" type=\"button\" ng-click=\"edit($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || !ngDomain || value.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlNumeric.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"txt{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <input type=\"number\" class=\"form-control\" id=\"txt{{id}}\" min=\"{{ngMin}}\" max=\"{{ngMax}}\" ng-model=\"ngModel\" ng-disabled=\"ngDisabled\" ng-change=\"changed()\" ctrl-text-allowed />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'not in range (' + ngMin + '-' + ngMax + ')' : 'value is required' }}\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlPassword.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"txt{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <input type=\"password\" class=\"form-control\" id=\"txt{{id}}\" ng-model=\"ngModel\" ng-disabled=\"ngDisabled\" ng-change=\"changed()\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlSelect.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"ddl{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <select class=\"form-control\" id=\"ddl{{id}}\" ng-model=\"ngModel\" ng-change=\"changed()\" ng-disabled=\"ngDisabled\">\r" +
    "\n" +
    "                <option ng-show=\"ngDefault\" value=\"\" ng-selected=\"!ngModel || notFound\">Please select</option>\r" +
    "\n" +
    "                <option ng-repeat=\"item in ngOptions\" value=\"{{item[valueField]}}\" ng-selected=\"item[valueField] === ngModel\">{{item[nameField]}}</option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.invalid ? 'invalid value' : 'value is required' }}\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlSelectList.html',
    "<div ng-class=\"{ 'ng-required': ngRequired, invalid: !ngDisabled && !valid, faulty: faulty }\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <ul class=\"ctrl-select-list-contents sortable-group\" ui-sortable=\"sortableOptions\" ng-model=\"ngModel\">\r" +
    "\n" +
    "            <li ng-repeat=\"item in ngModel track by $index\" ng-class=\"{ 'has-error': !ngDisabled && !valid && invalid[$index], 'has-feedback': !ngDisabled && !valid && invalid[$index] }\" class=\"form-control-feedback-container\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default glyphicon glyphicon-move\" type=\"button\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <select class=\"form-control\" id=\"ddl{{id}}{{$index}}\" ng-model=\"ngModel[$index]\" ng-change=\"changed()\">\r" +
    "\n" +
    "                        <option ng-show=\"ngDefault\" value=\"\" ng-selected=\"!item || notFound\">Please select</option>\r" +
    "\n" +
    "                        <option ng-repeat=\"option in ngOptions\" value=\"{{option[valueField]}}\" ng-selected=\"option[valueField] === item\">{{option[nameField]}}</option>\r" +
    "\n" +
    "                    </select>\r" +
    "\n" +
    "                    <span ng-show=\"!ngDisabled && !valid && invalid[$index]\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "                    <span class=\"input-group-btn\">\r" +
    "\n" +
    "                        <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" ng-click=\"clear($index)\" ng-disabled=\"ngDisabled\"></button>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"input-group insert-form-control form-control-feedback-container\" ng-class=\"{ 'has-error': !ngDisabled && !valid && faulty, 'has-feedback': !ngDisabled && !valid && faulty }\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" disabled=\"disabled\" />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid && faulty\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"{{ faults.exceeded ? 'maximum length: ' + ngMaxLength : (faults.empty ? 'value is required' : '') }}\"></span>\r" +
    "\n" +
    "            <span class=\"input-group-btn\">\r" +
    "\n" +
    "                <button class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" ng-click=\"add()\" ng-disabled=\"ngDisabled || ngModel.length &gt;= ngMaxLength\"></button>\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlTags.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <tags-input ng-model=\"model\" ng-disabled=\"ngDisabled\" placeholder=\"{{ngPlaceholder}}\"></tags-input>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlText.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"txt{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"txt{{id}}\" maxlength=\"{{ngMaxLength}}\" ng-model=\"ngModel\" ng-disabled=\"ngDisabled\" ng-change=\"changed()\" ctrl-text-allowed />\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/controls/form/ctrlTextArea.html',
    "<div ng-class=\"{ invalid: !ngDisabled && !valid }\">\r" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{ 'has-error': !ngDisabled && !valid, 'has-feedback': !ngDisabled && !valid }\">\r" +
    "\n" +
    "        <label ng-show=\"ngLabel\" class=\"control-label\" for=\"txt{{id}}\">{{ngLabel}}<small ng-show=\"ngTip\">({{ngTip}})</small></label>\r" +
    "\n" +
    "        <div class=\"form-control-feedback-container\">\r" +
    "\n" +
    "            <textarea class=\"form-control\" rows=\"{{ngRows}}\" id=\"txt{{id}}\" maxlength=\"{{ngMaxLength}}\" ng-model=\"ngModel\" ng-disabled=\"ngDisabled\" ng-change=\"changed()\"></textarea>\r" +
    "\n" +
    "            <span ng-show=\"!ngDisabled && !valid\" class=\"glyphicon glyphicon-ban-circle form-control-feedback\" tooltip=\"value is required\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/modals/containerSelector.html',
    "<div class=\"data-select\">\r" +
    "\n" +
    "    <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-selectable=\"true\" ng-select-mode=\"mode\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "        <ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "        </ctrl-grid-header>\r" +
    "\n" +
    "        <ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-empty>no containers</ctrl-grid-empty>\r" +
    "\n" +
    "        </ctrl-grid-footer>\r" +
    "\n" +
    "        <ctrl-grid-body>\r" +
    "\n" +
    "            <ctrl-grid-column>\r" +
    "\n" +
    "                {{ model.name }}\r" +
    "\n" +
    "            </ctrl-grid-column>\r" +
    "\n" +
    "        </ctrl-grid-body>\r" +
    "\n" +
    "    </ctrl-grid>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/modals/dataSelector.html',
    "<div class=\"data-select\">\r" +
    "\n" +
    "    <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-selectable=\"true\" ng-select-mode=\"mode\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "        <ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "        </ctrl-grid-header>\r" +
    "\n" +
    "        <ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "            <ctrl-grid-empty>no data</ctrl-grid-empty>\r" +
    "\n" +
    "        </ctrl-grid-footer>\r" +
    "\n" +
    "        <ctrl-grid-body>\r" +
    "\n" +
    "            <ctrl-grid-column>\r" +
    "\n" +
    "                {{ model.title[language] }}\r" +
    "\n" +
    "            </ctrl-grid-column>\r" +
    "\n" +
    "        </ctrl-grid-body>\r" +
    "\n" +
    "    </ctrl-grid>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/modals/fileSelector.html',
    "<div class=\"file-select\">\r" +
    "\n" +
    "    <ctrl-explorer ng-selectable=\"true\" ng-select-mode=\"mode\" ng-path=\"path\" ng-group=\"fileGroup\" ng-selected=\"selected\" ng-extensions=\"extensions\"></ctrl-explorer>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/modals/fsEditor.html',
    "<div class=\"fs-edit\">\r" +
    "\n" +
    "    <ctrl-text class=\"file-editor-name\" ng-model=\"ngModel\" ng-required=\"true\" ng-label=\"name\" ng-auto-focus=\"true\"></ctrl-text>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"file-editor-path\">\r" +
    "\n" +
    "        <label ng-click=\"root()\">path</label>\r" +
    "\n" +
    "        <ctrl-tree ng-model=\"nodes\" ng-selectable=\"true\" ng-select-mode=\"'single'\">\r" +
    "\n" +
    "            <ctrl-tree-node>\r" +
    "\n" +
    "                <ctrl-tree-node-content>{{ model.name }}</ctrl-tree-node-content>\r" +
    "\n" +
    "            </ctrl-tree-node>\r" +
    "\n" +
    "        </ctrl-tree>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/modals/imageSelector.html',
    "<div class=\"image-select\">\r" +
    "\n" +
    "    <ctrl-explorer ng-show=\"step == 1\" ng-selectable=\"true\" ng-select-mode=\"mode\" ng-path=\"path\" ng-group=\"fileGroup\" ng-selected=\"ngModel.src\" ng-extensions=\"extensions\"></ctrl-explorer>\r" +
    "\n" +
    "    <ctrl-image-cropper ng-show=\"step == 2\" ng-model=\"ngModel\" ng-height=\"height\" ng-width=\"width\"></ctrl-image-cropper>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/modals/nodeSelector.html',
    "<div class=\"node-select\">\r" +
    "\n" +
    "    <ctrl-tree ng-model=\"model\" ng-selectable=\"true\" ng-domain=\"domain\" ng-select-mode=\"mode\" ng-select-pointee=\"options.pointee\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "        <ctrl-tree-node>\r" +
    "\n" +
    "            <ctrl-tree-node-content>{{ model.title[language] }}</ctrl-tree-node-content>\r" +
    "\n" +
    "        </ctrl-tree-node>\r" +
    "\n" +
    "    </ctrl-tree>\r" +
    "\n" +
    "    <ctrl-tree-empty ng-model=\"model\" ng-domain=\"domain\">no nodes</ctrl-tree-empty>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/blank.html',
    "<!DOCTYPE html>\r" +
    "\n" +
    "<html>\r" +
    "\n" +
    "<head>\r" +
    "\n" +
    "</head>\r" +
    "\n" +
    "<body>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "</body>\r" +
    "\n" +
    "</html>"
  );


  $templateCache.put('admin/tmpl/core/pages/content.html',
    "<div class=\"row content-container\">\r" +
    "\n" +
    "    <div class=\"col-md-4\" ng-repeat=\"item in items\">\r" +
    "\n" +
    "        <div class=\"content-box\">\r" +
    "\n" +
    "            <a href=\"javascript:;\" ng-click=\"next(item.url)\">\r" +
    "\n" +
    "                <div class=\"image-container\">\r" +
    "\n" +
    "                    <img ng-src=\"{{item.image}}\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"text-container\">\r" +
    "\n" +
    "                    <h3 class=\"title\">{{ item.title }}</h3>\r" +
    "\n" +
    "                    <span class=\"subtitle\"></span>\r" +
    "\n" +
    "                    <p class=\"body\">{{ item.body }}</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/content/data.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">data</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-empty>no lists</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.name }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"open\" class=\"btn btn-default glyphicon glyphicon-th\" ng-click=\"fn.open(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/content/dataList.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no data</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.title[language] }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/content/files.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">files</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-explorer class=\"col-sm-12\"></ctrl-explorer>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/content/language.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"page-language\" data-scrollspy=\"language\">\r" +
    "\n" +
    "    <ctrl-select class=\"col-sm-10\" ng-model=\"data.code\" ng-label=\"language\" ng-options=\"options\" ng-name-field=\"name\" ng-value-field=\"code\" ng-auto-focus=\"true\"></ctrl-select>\r" +
    "\n" +
    "    <ctrl-check class=\"col-sm-2\" ng-model=\"data.active\" ng-disabled=\"data.default\" ng-label=\"active\"></ctrl-check>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />"
  );


  $templateCache.put('admin/tmpl/core/pages/content/languages.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">languages</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>code</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>active</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>default</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no languges</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.code }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.name }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    <input type=\"checkbox\" ng-disabled=\"true\" ng-checked=\"model.active\" />\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    <input type=\"checkbox\" ng-disabled=\"model.default || !model.active\" ng-checked=\"model.default\" ng-click=\"fn.setDefault(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"model.default || !fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/content/layout.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-show=\"tmpl\" ng-include=\"tmpl\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />"
  );


  $templateCache.put('admin/tmpl/core/pages/content/layouts.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">layouts</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-empty>no layouts</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.name }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/content/nodes.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">nodes</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-tree ng-model=\"model[0].children\" ng-domain=\"domain\" ng-fn=\"treeFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-tree-node>\r" +
    "\n" +
    "                <ctrl-tree-node-content>{{ model.title[language] }}</ctrl-tree-node-content>\r" +
    "\n" +
    "                <ctrl-tree-node-buttons>\r" +
    "\n" +
    "                    <button title=\"open\" class=\"btn btn-default btn-sm glyphicon glyphicon-th\" ng-show=\"fn.canOpen(model)\" ng-click=\"fn.open(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"create child\" class=\"btn btn-default btn-sm glyphicon glyphicon-plus-sign\" ng-disabled=\"!fn.canCreate(model)\" ng-click=\"fn.create(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default btn-sm glyphicon glyphicon-edit\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default btn-sm glyphicon glyphicon-remove\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\"></button>\r" +
    "\n" +
    "                </ctrl-tree-node-buttons>\r" +
    "\n" +
    "            </ctrl-tree-node>\r" +
    "\n" +
    "        </ctrl-tree>\r" +
    "\n" +
    "        <ctrl-tree-empty ng-model=\"model[0].children\" ng-domain=\"domain\">no nodes</ctrl-tree-empty>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('admin/tmpl/core/pages/content/text.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-text-key\" data-scrollspy=\"key\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <ctrl-text class=\"col-sm-5\" ng-model=\"text.group\" ng-validate=\"validateKey\" ng-valid=\"validation.key\" ng-characters=\"abcdefghijklmnopqrstuvwxyz_\" ng-label=\"group\"></ctrl-text>\r" +
    "\n" +
    "        <ctrl-text class=\"col-sm-5\" ng-model=\"text.key\" ng-required=\"true\" ng-validate=\"validateKey\" ng-valid=\"validation.key\" ng-characters=\"abcdefghijklmnopqrstuvwxyz0123456789_.\" ng-label=\"key\"></ctrl-text>                \r" +
    "\n" +
    "        <ctrl-check class=\"col-sm-2\" ng-model=\"text.html\" ng-label=\"rich text\"></ctrl-check>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <span class=\"row-validator\" ng-show=\"!validation.key\">combination of group and key already exists</span>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-text-value\" data-scrollspy=\"value\">\r" +
    "\n" +
    "    <div ng-repeat=\"language in languages\" class=\"row\" id=\"page-text-value-{{language.code}}\" data-scrollspy=\"{{language.name}}\">\r" +
    "\n" +
    "        <ctrl-text-area class=\"col-sm-12\" ng-model=\"text.value[language.code]\" ng-validating=\"!text.html\" ng-required=\"false\" ng-show=\"!text.html\" ng-label=\"{{application.localization.enabled ? language.name : 'value'}}\"></ctrl-text-area>\r" +
    "\n" +
    "        <ctrl-html class=\"col-sm-12\" ng-model=\"text.value[language.code]\" ng-validating=\"text.html\" ng-required=\"false\" ng-show=\"text.html\" ng-label=\"{{application.localization.enabled ? language.name : 'value'}}\"></ctrl-html>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n"
  );


  $templateCache.put('admin/tmpl/core/pages/content/texts.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">texts</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>group</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>key</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no texts</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.group }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.key }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/dashboard.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <h1 class=\"title\">dashboard</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-repeat=\"tmpl in injects\" ng-include=\"tmpl\"></div>"
  );


  $templateCache.put('admin/tmpl/core/pages/modules.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <h1 class=\"title\">modules</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>version</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-empty>no modules</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.domain }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.version }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"open\" class=\"btn btn-default btn-sm glyphicon glyphicon-th\" ng-disabled=\"!fn.canOpen(model)\" ng-click=\"fn.open(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/settings.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"settings-homeNode\" data-scrollspy=\"home page\">\r" +
    "\n" +
    "    <ctrl-node class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"settings.homepage\" ng-domain=\"'core'\" ng-required=\"true\" ng-entities=\"['page']\" ng-label=\"home page\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"settings-messaging\" data-scrollspy=\"messaging\">\r" +
    "\n" +
    "    <div class=\"col-sm-6\">\r" +
    "\n" +
    "        <label>messaging - mail</label>\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-select class=\"col-md-12\" ng-model=\"settings.messaging.mail.provider\" ng-required=\"false\" ng-options=\"mailProviders\"></ctrl-select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-include=\"mailTmpl\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"col-sm-6\">\r" +
    "\n" +
    "        <label>messaging - sms</label>\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-select class=\"col-md-12\" ng-model=\"settings.messaging.sms.provider\" ng-required=\"false\" ng-options=\"smsProviders\"></ctrl-select>\r" +
    "\n" +
    "            <div ng-include=\"smsTmpl\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-repeat=\"tmpl in injects\">\r" +
    "\n" +
    "    <div ng-include=\"tmpl\"></div>\r" +
    "\n" +
    "    <hr />\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/pages/user.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"user-username\" data-scrollspy=\"email\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-12\" ng-model=\"user.username\" ng-required=\"true\" ng-disabled=\"!isNew()\" ng-label=\"email\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "<div class=\"row\" id=\"user-name\" data-scrollspy=\"name\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"user.firstName\" ng-required=\"true\" ng-disabled=\"!isNew()\" ng-label=\"first name\"></ctrl-text>\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"user.lastName\" ng-required=\"true\" ng-disabled=\"!isNew()\" ng-label=\"last name\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"user-password\" data-scrollspy=\"password\" ng-show=\"isNew()\">\r" +
    "\n" +
    "    <ctrl-password class=\"col-sm-6\" ng-model=\"credentials.password\" ng-required=\"true\" ng-valid=\"!invalidPasswordComparison\" ng-disabled=\"!isNew()\" ng-label=\"password\"></ctrl-password>\r" +
    "\n" +
    "    <ctrl-password class=\"col-sm-6\" ng-model=\"credentials.passwordConfirmation\" ng-required=\"true\" ng-validate=\"validatePasswordConfirm\" ng-disabled=\"!isNew()\" ng-label=\"password confirmation\"></ctrl-password>\r" +
    "\n" +
    "    <span class=\"validation-error whole centered\" ng-show=\"invalidPasswordComparison\">passwords do not match</span>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"user-roles\" data-scrollspy=\"roles\">\r" +
    "\n" +
    "    <ctrl-check-list class=\"col-sm-12\" ng-model=\"user.roles\" ng-options=\"roles\" ng-required=\"true\" ng-disabled=\"!editRoles\" ng-label=\"roles\"></ctrl-check-list>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />"
  );


  $templateCache.put('admin/tmpl/core/pages/users.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <h1 class=\"title\">users</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>surname</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>forename</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>email</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no users</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.lastName }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.firstName }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.username }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/core/panels/pnlLogin.html',
    "<form name=\"loginForm\" method=\"post\" ng-submit=\"login()\" class=\"col-md-12\">\r" +
    "\n" +
    "    <div class=\"row username\">\r" +
    "\n" +
    "        <ctrl-text ng-model=\"username\" ng-required=\"true\" ng-label=\"email\"></ctrl-text>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row password\">\r" +
    "\n" +
    "        <ctrl-password ng-model=\"password\" ng-required=\"true\" ng-label=\"password\"></ctrl-password>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"row\" style=\"text-align:right\">\r" +
    "\n" +
    "        <div class=\"btn-group\">\r" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\">login</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <p class=\"text-danger failed\" ng-show=\"failed\">unsuccessful login attempt</p>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('admin/tmpl/core/panels/pnlRegistration.html',
    "<form name=\"registrationForm\" method=\"post\" ng-submit=\"register()\" class=\"col-md-12\">\r" +
    "\n" +
    "    <div class=\"row username\">\r" +
    "\n" +
    "        <ctrl-text ng-model=\"username\" ng-required=\"true\" ng-validate=\"validateEmail\" ng-label=\"email\"></ctrl-text>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row password\">\r" +
    "\n" +
    "        <ctrl-password ng-model=\"password\" ng-required=\"true\" ng-label=\"password\"></ctrl-password>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <ctrl-text ng-model=\"firstName\" ng-required=\"true\" ng-label=\"first name\"></ctrl-text>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <ctrl-text ng-model=\"lastName\" ng-required=\"true\" ng-label=\"last name\"></ctrl-text>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\" style=\"text-align:right\">\r" +
    "\n" +
    "        <div class=\"btn-group\">\r" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\">submit</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('admin/tmpl/core/partials/mail.html',
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-md-12\" ng-model=\"settings.messaging.mail.host\" ng-required=\"true\" ng-label=\"host\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"settings.messaging.mail.username\" ng-required=\"true\" ng-label=\"username\"></ctrl-text>\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"settings.messaging.mail.password\" ng-required=\"true\" ng-label=\"password\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-md-12\" ng-model=\"settings.messaging.mail.sender\" ng-required=\"true\" ng-label=\"sender\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-check class=\"col-md-12\" ng-model=\"settings.messaging.mail.ssl\" ng-label=\"ssl\"></ctrl-check>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('admin/tmpl/courses/courses.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create course\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "            <button title=\"edit set\" class=\"btn btn-default glyphicon glyphicon-edit\" type=\"button\" value=\"edit\" ng-disabled=\"!canEdit()\" ng-click=\"edit()\"></button>\r" +
    "\n" +
    "            <button title=\"delete set\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" value=\"delete\" ng-disabled=\"!canDelete()\" ng-click=\"delete()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>title</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no courses</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.title[language] }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"open\" class=\"btn btn-default btn-sm glyphicon glyphicon-th\" ng-disabled=\"!fn.canOpen(model)\" ng-click=\"fn.open(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/coursesSettings.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">settings</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-image-teaser\" data-scrollspy=\"teaser image\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.courseImageTeaserHeight\" ng-label=\"teaser image height\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.courseImageTeaserWidth\" ng-label=\"teaser image width\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-image-body\" data-scrollspy=\"body image\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.courseImageBodyHeight\" ng-label=\"body image height\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.courseImageBodyWidth\" ng-label=\"body image width\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n"
  );


  $templateCache.put('admin/tmpl/courses/form/course.html',
    "<div id=\"page-content-images\" data-scrollspy=\"images\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <ctrl-image class=\"col-sm-6\" ng-model=\"model.content.teaserImage\" ng-height=\"imageSize.teaser.height\" ng-width=\"imageSize.teaser.width\" ng-tip=\"{{imageTip.teaser}}\" ng-label=\"teaser image\"></ctrl-image>\r" +
    "\n" +
    "        <ctrl-image class=\"col-sm-6\" ng-model=\"model.content.image\" ng-height=\"imageSize.body.height\" ng-width=\"imageSize.body.width\" ng-tip=\"{{imageTip.body}}\" ng-label=\"body image\"></ctrl-image>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-teaser\" data-scrollspy=\"teaser\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].teaser\" ng-height=\"200\" ng-validating=\"model.active[language]\" ng-required=\"true\" ng-label=\"teaser\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-body\" data-scrollspy=\"body\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].body\" ng-height=\"200\" ng-max-height=\"400\" ng-validating=\"model.active[language]\" ng-required=\"true\" ng-label=\"body\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-levels\" data-scrollspy=\"level\" ng-show=\"entity.properties.levels\">\r" +
    "\n" +
    "    <ctrl-node-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"model.content.levels\" ng-domain=\"'courses'\" ng-disabled=\"!entity.properties.levels\" ng-entities=\"['courseLevel']\" ng-options=\"{ parentId: id }\" ng-label=\"levels\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node-list>\r" +
    "\n" +
    "</div>    \r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-tutors\" data-scrollspy=\"tutors\" ng-show=\"entity.properties.tutors\">\r" +
    "\n" +
    "    <ctrl-data-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"model.content.tutors\" ng-domain=\"'courses'\" ng-list-id=\"'tutors'\" ng-disabled=\"!entity.properties.tutors\" ng-label=\"tutors\">\r" +
    "\n" +
    "        {{model.content.localized[language].firstName}} {{model.content.localized[language].lastName}}\r" +
    "\n" +
    "    </ctrl-data-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/form/level.html',
    "<div class=\"row\" id=\"page-content-body\" data-scrollspy=\"body\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].body\" ng-height=\"200\" ng-max-height=\"400\" ng-validating=\"model.active[language]\" ng-required=\"true\" ng-label=\"body\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-tutors\" data-scrollspy=\"tutors\" ng-show=\"entity.properties.tutors\">\r" +
    "\n" +
    "    <ctrl-data-list class=\"col-sm-12\" ng-model=\"model.content.tutors\" ng-domain=\"'courses'\" ng-list-id=\"'tutors'\" ng-disabled=\"!entity.properties.tutors\" ng-language=\"defaults.language\" ng-label=\"tutors\">\r" +
    "\n" +
    "        {{model.content.localized[language].firstName}} {{model.content.localized[language].lastName}}\r" +
    "\n" +
    "    </ctrl-data-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/form/set.html',
    "<div class=\"row\" id=\"page-content-body\" data-scrollspy=\"body\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].body\" ng-height=\"200\" ng-max-height=\"400\" ng-validating=\"model.active[language]\" ng-label=\"body\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-courses\" data-scrollspy=\"courses\" ng-show=\"entity.properties.courses\">\r" +
    "\n" +
    "    <ctrl-node-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"model.content.courses\" ng-domain=\"'courses'\" ng-disabled=\"!entity.properties.courses\" ng-entities=\"['course']\" ng-options=\"{ parentId: id }\" ng-label=\"courses\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node-list>\r" +
    "\n" +
    "</div>    "
  );


  $templateCache.put('admin/tmpl/courses/form/tutor.html',
    "<div class=\"row\" id=\"page-content-name\" data-scrollspy=\"name\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"model.content.localized[language].firstName\" ng-validating=\"active[language]\" ng-required=\"true\" ng-label=\"first name\"></ctrl-text>\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"model.content.localized[language].lastName\" ng-validating=\"active[language]\" ng-required=\"true\" ng-label=\"last name\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-image\" data-scrollspy=\"image\">\r" +
    "\n" +
    "    <ctrl-image class=\"col-sm-12\" ng-model=\"model.content.image\" ng-height=\"imageSize.height\" ng-width=\"imageSize.width\" ng-tip=\"{{imageTip}}\" ng-label=\"image\"></ctrl-image>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-body\" data-scrollspy=\"body\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].body\" ng-height=\"200\" ng-max-height=\"400\" ng-validating=\"active[language]\" ng-required=\"true\" ng-label=\"body\"></ctrl-html>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/index.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">courses</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row content-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-6\" ng-repeat=\"item in items\">\r" +
    "\n" +
    "        <div class=\"content-box\">\r" +
    "\n" +
    "            <a href=\"javascript:;\" ng-click=\"next(item.url)\">\r" +
    "\n" +
    "                <div class=\"image-container\">\r" +
    "\n" +
    "                    <img ng-src=\"{{item.image}}\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"text-container\">\r" +
    "\n" +
    "                    <h3 class=\"title\">{{ item.title }}</h3>\r" +
    "\n" +
    "                    <span class=\"subtitle\"></span>\r" +
    "\n" +
    "                    <p class=\"body\">{{ item.body }}</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/levels.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create level\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "            <button title=\"edit course\" class=\"btn btn-default glyphicon glyphicon-edit\" type=\"button\" value=\"edit\" ng-disabled=\"!canEdit()\" ng-click=\"edit()\"></button>\r" +
    "\n" +
    "            <button title=\"delete course\" class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" value=\"delete\" ng-disabled=\"!canDelete()\" ng-click=\"delete()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>title</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no levels</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.title[language] }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/modal/tutorSelector.html',
    "<div class=\"data-select\">\r" +
    "\n" +
    "    <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-selectable=\"true\" ng-select-mode=\"mode\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "        <ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "        </ctrl-grid-header>\r" +
    "\n" +
    "        <ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "            <ctrl-grid-empty>no tutors</ctrl-grid-empty>\r" +
    "\n" +
    "        </ctrl-grid-footer>\r" +
    "\n" +
    "        <ctrl-grid-body>\r" +
    "\n" +
    "            <ctrl-grid-column>\r" +
    "\n" +
    "                {{ model.content.localized[language].firstName }} {{ model.content.localized[language].lastName }}\r" +
    "\n" +
    "            </ctrl-grid-column>\r" +
    "\n" +
    "        </ctrl-grid-body>\r" +
    "\n" +
    "    </ctrl-grid>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/sets.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">sets</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "            <button title=\"settings\" class=\"btn btn-default glyphicon glyphicon-cog\" type=\"button\" value=\"create\" ng-disabled=\"!canViewSettings()\" ng-click=\"viewSettings()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>title</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no course sets</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.title[language] }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"open\" class=\"btn btn-default btn-sm glyphicon glyphicon-th\" ng-disabled=\"!fn.canOpen(model)\" ng-click=\"fn.open(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/tutors.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "            <button title=\"settings\" class=\"btn btn-default glyphicon glyphicon-cog\" type=\"button\" value=\"create\" ng-disabled=\"!canViewSettings()\" ng-click=\"viewSettings()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>name</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>no tutors</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.content.localized[language].firstName }} {{ model.content.localized[language].lastName }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/courses/tutorsSettings.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">settings</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-image\" data-scrollspy=\"image\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.tutorImageHeight\" ng-label=\"image height\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.tutorImageWidth\" ng-label=\"image width\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n"
  );


  $templateCache.put('admin/tmpl/gAnalytics/settings.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">gAnalytics</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"settings-code\" data-scrollspy=\"tracking code\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-12\" ng-model=\"settings.code\" ng-required=\"true\" ng-auto-focus=\"true\" ng-label=\"Tracking code\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />"
  );


  $templateCache.put('admin/tmpl/gApi/settings.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">gApi</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"settings-key\" data-scrollspy=\"api key\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-12\" ng-model=\"settings.apiKey\" ng-required=\"true\" ng-auto-focus=\"true\" ng-label=\"Api Key\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />"
  );


  $templateCache.put('admin/tmpl/news/article.html',
    "<div class=\"row\" id=\"page-content-title\" data-scrollspy=\"title\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"model.title[language]\" ng-validating=\"model.active[language]\" ng-required=\"true\" ng-label=\"title\"></ctrl-text>\r" +
    "\n" +
    "    <ctrl-date-picker class=\"col-sm-4\" ng-model=\"model.content.date\" ng-required=\"true\" ng-label=\"date\"></ctrl-date-picker>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <ctrl-check class=\"col-sm-2\" ng-model=\"model.active[language]\" ng-label=\"active\"></ctrl-check>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-images\" data-scrollspy=\"images\">\r" +
    "\n" +
    "    <ctrl-image class=\"col-sm-6\" ng-model=\"model.content.teaserImage\" ng-height=\"imageSize.teaser.height\" ng-width=\"imageSize.teaser.width\" ng-tip=\"{{imageTip.teaser}}\" ng-required=\"true\" ng-label=\"teaser image\"></ctrl-image>\r" +
    "\n" +
    "    <ctrl-image class=\"col-sm-6\" ng-model=\"model.content.image\" ng-height=\"imageSize.body.height\" ng-width=\"imageSize.body.width\" ng-tip=\"{{imageTip.body}}\" ng-required=\"true\" ng-label=\"body image\"></ctrl-image>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-teaser\" data-scrollspy=\"teaser\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].teaser\" ng-height=\"200\" ng-validating=\"model.active[language]\" ng-required=\"true\" ng-label=\"teaser\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-body\" data-scrollspy=\"body\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"model.content.localized[language].body\" ng-height=\"200\" ng-max-height=\"400\" ng-validating=\"model.active[language]\" ng-required=\"true\" ng-label=\"body\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"page-content-gallery\" data-scrollspy=\"gallery\">\r" +
    "\n" +
    "    <ctrl-image-list class=\"col-sm-12\" ng-height=\"imageSize.gallery.height\" ng-width=\"imageSize.gallery.width\" ng-tip=\"{{imageTip.gallery}}\" ng-model=\"model.content.gallery\" ng-extensions=\"['.png', '.jpg', 'jpeg']\" ng-label=\"gallery\"></ctrl-image-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/news/articles.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">{{ title }}</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-grid class=\"table-striped\" ng-model=\"model\" ng-fn=\"gridFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-grid-header>\r" +
    "\n" +
    "                <ctrl-grid-header-column>date</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column>title</ctrl-grid-header-column>\r" +
    "\n" +
    "                <ctrl-grid-header-column></ctrl-grid-header-column>\r" +
    "\n" +
    "            </ctrl-grid-header>\r" +
    "\n" +
    "            <ctrl-grid-footer>\r" +
    "\n" +
    "                <ctrl-grid-infinite-scroll></ctrl-grid-infinite-scroll>\r" +
    "\n" +
    "                <ctrl-grid-empty>{{ text.empty }}</ctrl-grid-empty>\r" +
    "\n" +
    "            </ctrl-grid-footer>\r" +
    "\n" +
    "            <ctrl-grid-body>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.content.date | date:'DD/MM/YYYY' }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-column>\r" +
    "\n" +
    "                    {{ model.title[language] }}\r" +
    "\n" +
    "                </ctrl-grid-column>\r" +
    "\n" +
    "                <ctrl-grid-buttons-column>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default glyphicon glyphicon-edit btn-sm\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\" />\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default glyphicon glyphicon-remove btn-sm\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\" />\r" +
    "\n" +
    "                </ctrl-grid-buttons-column>\r" +
    "\n" +
    "            </ctrl-grid-body>\r" +
    "\n" +
    "        </ctrl-grid>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/news/categories.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">news</h1>\r" +
    "\n" +
    "        <div class=\"buttons\">\r" +
    "\n" +
    "            <button title=\"create new\" class=\"btn btn-default glyphicon glyphicon-plus-sign\" type=\"button\" value=\"create\" ng-disabled=\"!canCreate()\" ng-click=\"create()\"></button>\r" +
    "\n" +
    "            <button title=\"settings\" class=\"btn btn-default glyphicon glyphicon-cog\" type=\"button\" value=\"create\" ng-show=\"canViewSettings()\" ng-click=\"viewSettings()\"></button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <ctrl-tree ng-model=\"model[0].children\" ng-domain=\"domain\" ng-fn=\"treeFn\" ng-language=\"defaults.language\">\r" +
    "\n" +
    "            <ctrl-tree-node>\r" +
    "\n" +
    "                <ctrl-tree-node-content>{{ model.title[language] }}</ctrl-tree-node-content>\r" +
    "\n" +
    "                <ctrl-tree-node-buttons>\r" +
    "\n" +
    "                    <button title=\"open\" class=\"btn btn-default btn-sm glyphicon glyphicon-th\" ng-show=\"fn.canOpen(model)\" ng-disabled=\"!fn.canOpen(model)\" ng-click=\"fn.open(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"create child\" class=\"btn btn-default btn-sm glyphicon glyphicon-plus-sign\" ng-disabled=\"!fn.canCreate(model)\" ng-click=\"fn.create(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"edit\" class=\"btn btn-default btn-sm glyphicon glyphicon-edit\" ng-disabled=\"!fn.canEdit(model)\" ng-click=\"fn.edit(model)\"></button>\r" +
    "\n" +
    "                    <button title=\"delete\" class=\"btn btn-default btn-sm glyphicon glyphicon-remove\" ng-disabled=\"!fn.canDelete(model)\" ng-click=\"fn.delete(model)\"></button>\r" +
    "\n" +
    "                </ctrl-tree-node-buttons>\r" +
    "\n" +
    "            </ctrl-tree-node>\r" +
    "\n" +
    "        </ctrl-tree>\r" +
    "\n" +
    "        <ctrl-tree-empty ng-model=\"model[0].children\" ng-domain=\"domain\">no news</ctrl-tree-empty>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/news/category.html',
    "<div class=\"row\" id=\"page-content-article-template\" data-scrollspy=\"article template\">\r" +
    "\n" +
    "    <ctrl-select class=\"col-sm-10\" ng-model=\"values.articleTemplate\" ng-options=\"templates['article']\" ng-disabled=\"model.content.articleTemplate.inherits\" ng-required=\"true\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"article template\"></ctrl-select>\r" +
    "\n" +
    "    <ctrl-check class=\"col-sm-2\" ng-model=\"model.content.articleTemplate.inherits\" ng-label=\"inheritance\"></ctrl-check>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/news/settings.html',
    "<div class=\"row title-container\">\r" +
    "\n" +
    "    <div class=\"col-sm-12\">\r" +
    "\n" +
    "        <span ng-click=\"back()\" class=\"glyphicon glyphicon-arrow-left back-button\"></span>\r" +
    "\n" +
    "        <h1 class=\"title\">news settings</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-article-template\" data-scrollspy=\"article template\">\r" +
    "\n" +
    "    <ctrl-select class=\"col-sm-12\" ng-model=\"settings.articleTemplate\" ng-options=\"templates\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"article template\"></ctrl-select>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-image-teaser\" data-scrollspy=\"teaser image\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.imageTeaserHeight\" ng-required=\"true\" ng-label=\"teaser image height\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.imageTeaserWidth\" ng-required=\"true\" ng-label=\"teaser image width\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-image-body\" data-scrollspy=\"body image\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.imageBodyHeight\" ng-required=\"true\" ng-label=\"body image height\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.imageBodyWidth\" ng-required=\"true\" ng-label=\"body image width\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"row\" id=\"setting-gallery-images\" data-scrollspy=\"gallery images\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.imageGalleryHeight\" ng-required=\"true\" ng-label=\"gallery image height\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"settings.imageGalleryWidth\" ng-required=\"true\" ng-label=\"gallery image width\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<hr />"
  );


  $templateCache.put('admin/tmpl/public/contactPage.html',
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-map class=\"col-sm-12\" ng-model=\"model.content.coordinates\"\r" +
    "\n" +
    "              ng-required=\"true\"\r" +
    "\n" +
    "              ng-label=\"gmaps\">\r" +
    "\n" +
    "    </ctrl-map>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/forms/list/telephones.html',
    "<div class=\"row\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"model.content.test\" ng-required=\"false\" ng-label=\"test\"></ctrl-text>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/check.html',
    "<div ng-init=\"checkOptions = [{ name: 'noindex', value: 'noindex', description: 'do not index this page' }, { name: 'nofollow', value: 'nofollow', description: 'do not follow any links' }, { name: 'noarchive', value: 'noarchive', description: 'do not show a cached link'}];\">\r" +
    "\n" +
    "    <div class=\"row\" id=\"layout-check\" data-scrollspy=\"check\">\r" +
    "\n" +
    "        <ctrl-check-list class=\"col-sm-10\" ng-model=\"layout.content.checks\" ng-options=\"checkOptions\" ng-disabled=\"!checked\" ng-required=\"false\" ng-label=\"checks\"></ctrl-check-list>\r" +
    "\n" +
    "        <ctrl-check class=\"col-sm-2\" ng-model=\"checked\" ng-change-fn=\"null\" ng-label=\"check\"></ctrl-check>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\" id=\"layout-checkR\" data-scrollspy=\"check required\">\r" +
    "\n" +
    "        <ctrl-check-list class=\"col-sm-10\" ng-model=\"layout.content.checksR\" ng-options=\"checkOptions\" ng-disabled=\"!checkedR\" ng-required=\"true\" ng-label=\"checks required\"></ctrl-check-list>\r" +
    "\n" +
    "        <ctrl-check class=\"col-sm-2\" ng-model=\"checkedR\" ng-change-fn=\"null\" ng-label=\"check\"></ctrl-check>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/container.html',
    "<div class=\"row\" id=\"layout-container\" data-scrollspy=\"container\">\r" +
    "\n" +
    "    <ctrl-container class=\"col-sm-12\" ng-model=\"layout.content.container\" ng-required=\"false\" ng-label=\"container\"></ctrl-container>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-containerR\" data-scrollspy=\"container required\">\r" +
    "\n" +
    "    <ctrl-container class=\"col-sm-12\" ng-model=\"layout.content.containerR\" ng-required=\"true\" ng-label=\"container required\"></ctrl-container>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-containers\" data-scrollspy=\"containers\">\r" +
    "\n" +
    "    <ctrl-container-list class=\"col-sm-12\" ng-model=\"layout.content.containers\" ng-required=\"false\" ng-max-length=\"2\" ng-label=\"containers (max length 2)\"></ctrl-container-list>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-containersR\" data-scrollspy=\"containers required\">\r" +
    "\n" +
    "    <ctrl-container-list class=\"col-sm-12\" ng-model=\"layout.content.containersR\" ng-required=\"true\" ng-max-length=\"2\" ng-label=\"containers required (max length 2)\"></ctrl-container-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/custom.html',
    "<div class=\"row\" id=\"layout-custom\" data-scrollspy=\"custom\">\r" +
    "\n" +
    "    <ctrl-custom class=\"col-sm-12\" ng-model=\"layout.content.custom\" ng-label=\"custom\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-model=\"model.alpha\"></ctrl-text>\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-model=\"model.vita\"></ctrl-text>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ctrl-custom>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-customR\" data-scrollspy=\"custom required\">\r" +
    "\n" +
    "    <ctrl-custom class=\"col-sm-12\" ng-model=\"layout.content.customR\" ng-required=\"true\" ng-label=\"custom required\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-required=\"ngRequired\" ng-model=\"model.alpha\"></ctrl-text>\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-required=\"ngRequired\" ng-model=\"model.vita\"></ctrl-text>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ctrl-custom>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-customs\" data-scrollspy=\"customs\">\r" +
    "\n" +
    "    <ctrl-custom-list class=\"col-sm-12\" ng-model=\"layout.content.customs\" ng-label=\"customs\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-model=\"model.alpha\"></ctrl-text>\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-model=\"model.vita\"></ctrl-text>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ctrl-custom-list>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-customsR\" data-scrollspy=\"customs required\">\r" +
    "\n" +
    "    <ctrl-custom-list class=\"col-sm-12\" ng-model=\"layout.content.customsR\" ng-required=\"true\" ng-max-length=\"2\" ng-label=\"customs required (max length: 2)\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-required=\"true\" ng-model=\"model.alpha\"></ctrl-text>\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-model=\"model.vita\"></ctrl-text>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ctrl-custom-list>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-address\" data-scrollspy=\"address\">\r" +
    "\n" +
    "    <ctrl-custom class=\"col-sm-12\" ng-model=\"layout.content.contact\" ng-scope=\"{}\" ng-label=\"contact\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-6\" ng-model=\"model.address\" ng-required=\"true\" ng-disabled=\"ngDisabled\" ng-label=\"address\"></ctrl-text>\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-3\" ng-model=\"model.postCode\" ng-required=\"true\" ng-disabled=\"ngDisabled\" ng-label=\"post code\"></ctrl-text>\r" +
    "\n" +
    "            <ctrl-text class=\"col-sm-3\" ng-model=\"model.city\" ng-required=\"true\" ng-disabled=\"ngDisabled\" ng-label=\"city\"></ctrl-text>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <ctrl-map class=\"col-sm-12\" ng-model=\"model.coordinates\" ng-required=\"true\" ng-label=\"coordinates\" ng-disabled=\"ngDisabled\"></ctrl-map>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </ctrl-custom>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/data.html',
    "<div class=\"row\" id=\"layout-datum\" data-scrollspy=\"datum\">\r" +
    "\n" +
    "    <ctrl-data class=\"col-sm-6\" ng-language=\"defaults.language\" ng-model=\"layout.content.datum\" ng-domain=\"'public'\" ng-list-id=\"'telephones'\" ng-label=\"datum\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-data>\r" +
    "\n" +
    "    <ctrl-data class=\"col-sm-6\" ng-language=\"defaults.language\" ng-model=\"layout.content.datumR\" ng-domain=\"'public'\" ng-required=\"true\" ng-list-id=\"'telephones'\" ng-label=\"datum required\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-data>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-data\" data-scrollspy=\"data\">\r" +
    "\n" +
    "    <ctrl-data-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"layout.content.data\" ng-domain=\"'public'\" ng-list-id=\"'telephones'\" ng-label=\"data\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-data-list>\r" +
    "\n" +
    "    <ctrl-data-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"layout.content.dataR\" ng-domain=\"'public'\" ng-required=\"true\" ng-list-id=\"'telephones'\" ng-max-length=\"2\" ng-label=\"data required (max length: 2)\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-data-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/date.html',
    "<div class=\"row\" id=\"layout-date\" data-scrollspy=\"date\">\r" +
    "\n" +
    "    <ctrl-date-picker class=\"col-sm-6\" ng-model=\"layout.content.date\" ng-required=\"false\" ng-label=\"date\"></ctrl-date-picker>\r" +
    "\n" +
    "    <ctrl-date-picker class=\"col-sm-6\" ng-model=\"layout.content.dateR\" ng-required=\"true\" ng-label=\"date required\"></ctrl-date-picker>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-datetime\" data-scrollspy=\"datetime\">\r" +
    "\n" +
    "    <ctrl-date-picker class=\"col-sm-6\" ng-model=\"layout.content.datetime\" ng-required=\"false\" ng-time=\"true\" ng-label=\"datetime\"></ctrl-date-picker>\r" +
    "\n" +
    "    <ctrl-date-picker class=\"col-sm-6\" ng-model=\"layout.content.datetimeR\" ng-required=\"true\" ng-time=\"true\" ng-label=\"datetime required\"></ctrl-date-picker>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/file.html',
    "<div class=\"row\" id=\"layout-file\" files-scrollspy=\"file\">\r" +
    "\n" +
    "    <ctrl-file class=\"col-sm-6\" ng-model=\"layout.content.file\" ng-label=\"file\"></ctrl-file>\r" +
    "\n" +
    "    <ctrl-file class=\"col-sm-6\" ng-model=\"layout.content.fileR\" ng-required=\"true\" ng-label=\"file required\"></ctrl-file>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-files\" files-scrollspy=\"files\">\r" +
    "\n" +
    "    <ctrl-file-list class=\"col-sm-12\" ng-model=\"layout.content.files\" ng-label=\"files\"></ctrl-file-list>\r" +
    "\n" +
    "    <ctrl-file-list class=\"col-sm-12\" ng-model=\"layout.content.filesR\" ng-required=\"true\" ng-max-length=\"2\" ng-label=\"files required (max length: 2)\"></ctrl-file-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/html.html',
    "<div class=\"row\" id=\"layout-html\" data-scrollspy=\"html\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"layout.content.html\" ng-required=\"false\" ng-max-height=\"200\" ng-label=\"html\"></ctrl-html>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-htmlR\" data-scrollspy=\"html required\">\r" +
    "\n" +
    "    <ctrl-html class=\"col-sm-12\" ng-model=\"layout.content.htmlR\" ng-required=\"true\" ng-height=\"200\" ng-label=\"html required\"></ctrl-html>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/image.html',
    "<div class=\"row\" id=\"layout-image\" images-scrollspy=\"image\">\r" +
    "\n" +
    "    <ctrl-image class=\"col-sm-6\" ng-model=\"layout.content.image\" ng-label=\"image\"></ctrl-image>\r" +
    "\n" +
    "    <ctrl-image class=\"col-sm-6\" ng-model=\"layout.content.imageR\" ng-required=\"true\" ng-label=\"image required\"></ctrl-image>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-images\" images-scrollspy=\"images\">\r" +
    "\n" +
    "    <ctrl-image-list class=\"col-sm-12\" ng-model=\"layout.content.images\" ng-label=\"images\"></ctrl-image-list>\r" +
    "\n" +
    "    <ctrl-image-list class=\"col-sm-12\" ng-model=\"layout.content.imagesR\" ng-required=\"true\" ng-max-length=\"2\" ng-label=\"images required (max length: 2)\"></ctrl-image-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/node.html',
    "<div class=\"row\" id=\"layout-node\" data-scrollspy=\"node\">\r" +
    "\n" +
    "    <ctrl-node class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"layout.content.node\" ng-domain=\"'core'\" ng-required=\"false\" ng-label=\"node\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-nodeR\" data-scrollspy=\"node required\">\r" +
    "\n" +
    "    <ctrl-node class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"layout.content.nodeR\" ng-domain=\"'core'\" ng-required=\"true\" ng-label=\"node required\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-nodes\" data-scrollspy=\"nodes\">\r" +
    "\n" +
    "    <ctrl-node-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"layout.content.nodes\" ng-domain=\"'core'\" ng-required=\"false\" ng-max-length=\"2\" ng-label=\"nodes (max length 2)\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node-list>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-nodesR\" data-scrollspy=\"nodes required\">\r" +
    "\n" +
    "    <ctrl-node-list class=\"col-sm-12\" ng-language=\"defaults.language\" ng-model=\"layout.content.nodesR\" ng-domain=\"'core'\" ng-required=\"true\" ng-max-length=\"2\" ng-label=\"nodes required (max length 2)\">\r" +
    "\n" +
    "        {{model.title[language]}}\r" +
    "\n" +
    "    </ctrl-node-list>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/select.html',
    "<div ng-init=\"options = [{id: '1', name: 'option 1'}, {id: '2', name: 'option 2'}, {id: '3', name: 'option 3'}];\">\r" +
    "\n" +
    "    <div class=\"row\" id=\"layout-select\" data-scrollspy=\"select\">\r" +
    "\n" +
    "        <ctrl-select class=\"col-sm-6\" ng-model=\"layout.content.select\" ng-required=\"false\" ng-options=\"options\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"select\"></ctrl-select>\r" +
    "\n" +
    "        <ctrl-select class=\"col-sm-6\" ng-model=\"layout.content.selectR\" ng-required=\"true\" ng-options=\"options\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"select required\"></ctrl-select>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\" id=\"layout-selects\" data-scrollspy=\"selects\">\r" +
    "\n" +
    "        <ctrl-select-list class=\"col-sm-12\" ng-model=\"layout.content.selects\" ng-required=\"false\" ng-options=\"options\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-label=\"selects\"></ctrl-select-list>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\" id=\"layout-selectsR\" data-scrollspy=\"selectsR\">\r" +
    "\n" +
    "        <ctrl-select-list class=\"col-sm-12\" ng-model=\"layout.content.selectsR\" ng-required=\"true\" ng-options=\"options\" ng-default=\"true\" ng-value-field=\"id\" ng-name-field=\"name\" ng-max-length=\"2\" ng-label=\"selects required (max length: 2)\"></ctrl-select-list>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/tags.html',
    "<div class=\"row\" id=\"layout-tags\" data-scrollspy=\"tags\">\r" +
    "\n" +
    "    <ctrl-tags class=\"col-sm-12\" ng-model=\"layout.content.tags\" ng-required=\"false\" ng-label=\"tags\"></ctrl-tags>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-tagsR\" data-scrollspy=\"tags required\">\r" +
    "\n" +
    "    <ctrl-tags class=\"col-sm-12\" ng-model=\"layout.content.tagsR\" ng-required=\"true\" ng-label=\"tags required\"></ctrl-tags>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/tmpl/public/layouts/text.html',
    "<div class=\"row\" id=\"layout-text\" data-scrollspy=\"text\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"layout.content.text\" ng-required=\"false\" ng-max-length=\"10\" ng-label=\"text\"></ctrl-text>\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-6\" ng-model=\"layout.content.textR\" ng-required=\"true\" ng-max-length=\"10\" ng-label=\"text required\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-textL\" data-scrollspy=\"text limited\">\r" +
    "\n" +
    "    <ctrl-text class=\"col-sm-12\" ng-model=\"layout.content.textL\" ng-required=\"false\" ng-max-length=\"10\" ng-characters=\"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_\" ng-label=\"text limited (abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_)\"></ctrl-text>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-textArea\" data-scrollspy=\"text area\">\r" +
    "\n" +
    "    <ctrl-text-area class=\"col-sm-12\" ng-model=\"layout.content.textArea\" ng-required=\"false\" ng-max-length=\"20\" ng-label=\"text area\"></ctrl-text-area>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-textAreaR\" data-scrollspy=\"text area required\">\r" +
    "\n" +
    "    <ctrl-text-area class=\"col-sm-12\" ng-model=\"layout.content.textAreaR\" ng-required=\"true\" ng-max-length=\"20\" ng-rows=\"5\" ng-label=\"text area required\"></ctrl-text-area>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-numeric\" data-scrollspy=\"numeric\">\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"layout.content.numeric\" ng-required=\"false\" ng-min=\"1\" ng-max=\"10\" ng-label=\"numeric (1-10)\"></ctrl-numeric>\r" +
    "\n" +
    "    <ctrl-numeric class=\"col-sm-6\" ng-model=\"layout.content.numericR\" ng-required=\"true\" ng-min=\"1\" ng-max=\"10\" ng-label=\"numeric required (1-10)\"></ctrl-numeric>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\" id=\"layout-password\" data-scrollspy=\"password\">\r" +
    "\n" +
    "    <ctrl-password class=\"col-sm-6\" ng-model=\"layout.content.password\" ng-required=\"false\" ng-label=\"password\"></ctrl-password>\r" +
    "\n" +
    "    <ctrl-password class=\"col-sm-6\" ng-model=\"layout.content.passwordR\" ng-required=\"true\" ng-label=\"password required\"></ctrl-password>\r" +
    "\n" +
    "</div>"
  );

}]);
