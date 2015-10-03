module.exports = [{
    name: 'admin-lib',
    items: [
        '/admin/js/core/lib/jquery.js',
        '/admin/js/core/lib/angular.js',
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
        '/admin/js/core/cms/main.js',
        '/admin/js/core/cms/entity.js',
        '/admin/js/core/cms/router.js',
        '/admin/js/core/cms/constants/AUTH_EVENTS.js',
        '/admin/js/core/cms/constants/CONTROL_EVENTS.js',
        '/admin/js/core/cms/constants/DATA_EVENTS.js',
        '/admin/js/core/cms/constants/MODAL_EVENTS.js',
        '/admin/js/core/cms/constants/ROUTE_EVENTS.js',
        '/admin/js/core/cms/controllers/base/ControllerBase.js',
        '/admin/js/core/cms/controllers/base/ListControllerBase.js',
        '/admin/js/core/cms/controllers/base/TreeControllerBase.js',
        '/admin/js/core/cms/controllers/base/FormControllerBase.js',
        '/admin/js/core/cms/controllers/base/DataListControllerBase.js',
        '/admin/js/core/cms/controllers/base/DataFormControllerBase.js',
        '/admin/js/core/cms/controllers/base/NodeFormControllerBase.js',
        '/admin/js/core/cms/controllers/base/SettingsControllerBase.js',
        '/admin/js/core/cms/controllers/AppController.js',
        '/admin/js/core/cms/controllers/DashboardController.js',
        '/admin/js/core/cms/controllers/ContentController.js',
        '/admin/js/core/cms/controllers/LanguagesController.js',
        '/admin/js/core/cms/controllers/LanguageController.js',
        '/admin/js/core/cms/controllers/LayoutsController.js',
        '/admin/js/core/cms/controllers/LayoutController.js',
        '/admin/js/core/cms/controllers/DataController.js',
        '/admin/js/core/cms/controllers/DataListController.js',
        '/admin/js/core/cms/controllers/DataListItemController.js',
        '/admin/js/core/cms/controllers/NodesController.js',
        '/admin/js/core/cms/controllers/NodeController.js',
        '/admin/js/core/cms/controllers/ModulesController.js',        
        '/admin/js/core/cms/controllers/TextsController.js',
        '/admin/js/core/cms/controllers/TextController.js',
        '/admin/js/core/cms/controllers/UsersController.js',
        '/admin/js/core/cms/controllers/UserController.js',
        '/admin/js/core/cms/controllers/FilesController.js',
        '/admin/js/core/cms/controllers/SettingsController.js',
        '/admin/js/core/cms/controllers/modal/ErrorPromptController.js',
        '/admin/js/core/cms/controllers/modal/ContainerSelectorController.js',
        '/admin/js/core/cms/controllers/modal/DataSelectorController.js',
        '/admin/js/core/cms/controllers/modal/DeletePromptController.js',
        '/admin/js/core/cms/controllers/modal/FileSelectorController.js',
        '/admin/js/core/cms/controllers/modal/FileSystemEditorController.js',
        '/admin/js/core/cms/controllers/modal/FileUploadController.js',
        '/admin/js/core/cms/controllers/modal/ImageSelectorController.js',
        '/admin/js/core/cms/controllers/modal/NamePromptController.js',
        '/admin/js/core/cms/controllers/modal/NodeSelectorController.js',
        '/admin/js/core/cms/controls/ctrlBreadcrumb.js',
        '/admin/js/core/cms/controls/ctrlCheck.js',
        '/admin/js/core/cms/controls/ctrlCheckList.js',
        '/admin/js/core/cms/controls/ctrlContainer.js',
        '/admin/js/core/cms/controls/ctrlContainerList.js',
        '/admin/js/core/cms/controls/ctrlData.js',
        '/admin/js/core/cms/controls/ctrlDataList.js',
        '/admin/js/core/cms/controls/ctrlExplorer.js',
        '/admin/js/core/cms/controls/ctrlFile.js',
        '/admin/js/core/cms/controls/ctrlFileList.js',
        '/admin/js/core/cms/controls/ctrlGrid.js',
        '/admin/js/core/cms/controls/ctrlHtml.js',
        '/admin/js/core/cms/controls/ctrlImage.js',
        '/admin/js/core/cms/controls/ctrlImageCropper.js',
        '/admin/js/core/cms/controls/ctrlImageList.js',
        '/admin/js/core/cms/controls/ctrlLogin.js',
        '/admin/js/core/cms/controls/ctrlNode.js',
        '/admin/js/core/cms/controls/ctrlNodeList.js',
        '/admin/js/core/cms/controls/ctrlPassword.js',
        '/admin/js/core/cms/controls/ctrlRegistration.js',
        '/admin/js/core/cms/controls/ctrlSelect.js',
        '/admin/js/core/cms/controls/ctrlSelectList.js',
        '/admin/js/core/cms/controls/ctrlText.js',
        '/admin/js/core/cms/controls/ctrlTextArea.js',
        '/admin/js/core/cms/controls/ctrlNumeric.js',
        '/admin/js/core/cms/controls/ctrlDatePicker.js',
        '/admin/js/core/cms/controls/ctrlTree.js',
        '/admin/js/core/cms/controls/ctrlCustom.js',
        '/admin/js/core/cms/controls/ctrlCustomList.js',
        '/admin/js/core/cms/providers/$data.js',
        '/admin/js/core/cms/providers/$fn.js',
        '/admin/js/core/cms/providers/$jsnbt.js',
        '/admin/js/core/cms/providers/$logger.js',
        '/admin/js/core/cms/providers/$queue.js',
        '/admin/js/core/cms/services/AuthService.js',
        '/admin/js/core/cms/services/FileService.js',
        '/admin/js/core/cms/services/FunctionService.js',
        '/admin/js/core/cms/services/LocationService.js',
        '/admin/js/core/cms/services/ModalService.js',
        '/admin/js/core/cms/services/PagedDataService.js',
        '/admin/js/core/cms/services/ScrollSpyService.js',
        '/admin/js/core/cms/services/TreeNodeService.js',
        '/admin/js/core/cms/utils/date.js',
        '/admin/js/core/cms/utils/modal.js',
        '/admin/js/core/cms/utils/scrollspy.js',
        '/admin/js/core/cms/utils/errSrc.js',
        '/admin/js/core/cms/utils/lkRepeat.js',
        '/admin/js/init.js'
    ]
}, {
    name: 'admin-inline',
    process: false,
    items: [
         //'http://asdasd.com/asdfasf/qwerqwerqw'
    ]
}];