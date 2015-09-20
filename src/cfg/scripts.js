module.exports = [{
    name: 'admin-lib',
    items: [
        '/admin/js/core/lib/jquery.js',
        '/admin/js/core/lib/angular.js',
        '/admin/js/core/lib/jsonlite.js',
        '/admin/js/core/lib/bootstrap/bootstrap.js',
        '/admin/js/core/lib/bootstrap/bootstrap.switch.js',
        '/admin/js/core/lib/angular/angular-bootstrap.js',
        '/admin/js/core/lib/angular/angular-bootstrap-tpls.js',
        '/admin/js/core/lib/angular/angular-ui-sortable.js',
        '/admin/js/core/lib/angular/angular.animate.js',
        '/admin/js/core/lib/angular/angular.route.js',
        '/admin/js/core/lib/angular/angular.sanitize.js',
        '/admin/js/core/lib/angular/angular.strap.js',
        '/admin/js/core/lib/cropper/cropper.js',
        '/admin/js/core/lib/jquery/jquery-inViewport.js',
        '/admin/js/core/lib/jquery/jquery-ui.js',
        '/admin/js/core/lib/jquery/jquery.scrollTo.js',
        '/admin/js/core/lib/ng-flow/ng-flow.js',
        '/admin/js/core/lib/bootstrap/bootstrap.datepicker.js',
        '/admin/js/core/lib/ngInfiniteScroll/ngInfiniteScroll.js',
        '/admin/js/core/lib/redactor/a-redactor.js',
        '/admin/js/core/lib/redactor/b-angular-redactor.js',
        '/admin/js/core/lib/underscore/underscore.js',
        '/admin/js/core/lib/underscore/underscore.string.js',
        '/admin/js/core/lib/moment.js',
        '/admin/js/core/lib/moment-timezone.js',
        '/admin/js/core/lib/bootstrap-datetimepicker.js'
    ]
}, {
    name: 'admin-app',
    items: [
        '/jsnbt.js',
        '/admin/js/core/app/main.js',
        '/admin/js/core/app/constants/AUTH_EVENTS.js',
        '/admin/js/core/app/constants/CONTROL_EVENTS.js',
        '/admin/js/core/app/constants/DATA_EVENTS.js',
        '/admin/js/core/app/constants/MODAL_EVENTS.js',
        '/admin/js/core/app/constants/ROUTE_EVENTS.js',
        '/admin/js/core/app/controllers/base/ListControllerBase.js',
        '/admin/js/core/app/controllers/base/TreeControllerBase.js',
        '/admin/js/core/app/controllers/base/FormControllerBase.js',
        '/admin/js/core/app/controllers/base/NodeFormControllerBase.js',
        '/admin/js/core/app/controllers/base/SettingsControllerBase.js',
        '/admin/js/core/app/controllers/AppController.js',
        '/admin/js/core/app/controllers/ContentController.js',
        '/admin/js/core/app/controllers/DashboardController.js',
        '/admin/js/core/app/controllers/DataController.js',
        '/admin/js/core/app/controllers/FilesController.js',
        '/admin/js/core/app/controllers/LanguageController.js',
        '/admin/js/core/app/controllers/LanguagesController.js',
        '/admin/js/core/app/controllers/LayoutController.js',
        '/admin/js/core/app/controllers/LayoutsController.js',
        '/admin/js/core/app/controllers/ListController.js',
        '/admin/js/core/app/controllers/ListEntryController.js',
        '/admin/js/core/app/controllers/ModulesController.js',
        '/admin/js/core/app/controllers/NodeController.js',
        '/admin/js/core/app/controllers/NodesController.js',
        '/admin/js/core/app/controllers/SettingsController.js',
        '/admin/js/core/app/controllers/TextController.js',
        '/admin/js/core/app/controllers/TextsController.js',
        '/admin/js/core/app/controllers/UserController.js',
        '/admin/js/core/app/controllers/UsersController.js',
        '/admin/js/core/app/controllers/modal/ErrorPromptController.js',
        '/admin/js/core/app/controllers/modal/ContainerSelectorController.js',
        '/admin/js/core/app/controllers/modal/DataSelectorController.js',
        '/admin/js/core/app/controllers/modal/DeletePromptController.js',
        '/admin/js/core/app/controllers/modal/FileSelectorController.js',
        '/admin/js/core/app/controllers/modal/FileSystemEditorController.js',
        '/admin/js/core/app/controllers/modal/FileUploadController.js',
        '/admin/js/core/app/controllers/modal/ImageSelectorController.js',
        '/admin/js/core/app/controllers/modal/NamePromptController.js',
        '/admin/js/core/app/controllers/modal/NodeSelectorController.js',
        '/admin/js/core/app/filters/date.js',
        '/admin/js/core/app/directives/modal.js',
        '/admin/js/core/app/directives/scrollspy.js',
        '/admin/js/core/app/directives/errSrc.js',
        '/admin/js/core/app/directives/controls/ctrlBreadcrumb.js',
        '/admin/js/core/app/directives/controls/ctrlCheck.js',
        '/admin/js/core/app/directives/controls/ctrlCheckList.js',
        '/admin/js/core/app/directives/controls/ctrlContainer.js',
        '/admin/js/core/app/directives/controls/ctrlContainerList.js',
        '/admin/js/core/app/directives/controls/ctrlData.js',
        '/admin/js/core/app/directives/controls/ctrlDataList.js',
        '/admin/js/core/app/directives/controls/ctrlExplorer.js',
        '/admin/js/core/app/directives/controls/ctrlFile.js',
        '/admin/js/core/app/directives/controls/ctrlFileList.js',
        '/admin/js/core/app/directives/controls/ctrlGrid.js',
        '/admin/js/core/app/directives/controls/ctrlHtml.js',
        '/admin/js/core/app/directives/controls/ctrlImage.js',
        '/admin/js/core/app/directives/controls/ctrlImageCropper.js',
        '/admin/js/core/app/directives/controls/ctrlImageList.js',
        '/admin/js/core/app/directives/controls/ctrlLogin.js',
        '/admin/js/core/app/directives/controls/ctrlNode.js',
        '/admin/js/core/app/directives/controls/ctrlNodeList.js',
        '/admin/js/core/app/directives/controls/ctrlPassword.js',
        '/admin/js/core/app/directives/controls/ctrlRegistration.js',
        '/admin/js/core/app/directives/controls/ctrlSelect.js',
        '/admin/js/core/app/directives/controls/ctrlText.js',
        '/admin/js/core/app/directives/controls/ctrlTextArea.js',
        '/admin/js/core/app/directives/controls/ctrlNumeric.js',
        '/admin/js/core/app/directives/controls/ctrlDatePicker.js',
        '/admin/js/core/app/directives/controls/ctrlTree.js',
        '/admin/js/core/app/providers/$data.js',
        '/admin/js/core/app/providers/$fn.js',
        '/admin/js/core/app/providers/$jsnbt.js',
        '/admin/js/core/app/providers/$logger.js',
        '/admin/js/core/app/providers/$queue.js',
        '/admin/js/core/app/services/AuthService.js',
        '/admin/js/core/app/services/FileService.js',
        '/admin/js/core/app/services/FunctionService.js',
        '/admin/js/core/app/services/LocationService.js',
        '/admin/js/core/app/services/ModalService.js',
        '/admin/js/core/app/services/PagedDataService.js',
        '/admin/js/core/app/services/ScrollSpyService.js',
        '/admin/js/core/app/services/TreeNodeService.js',
        '/admin/js/init.js'
    ]
}, {
    name: 'admin-inline',
    process: false,
    items: [
         //'http://asdasd.com/asdfasf/qwerqwerqw'
    ]
}];