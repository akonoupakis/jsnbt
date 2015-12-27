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
        '/admin/js/core/lib/bootstrap-datetimepicker.js',
        '/admin/js/core/lib/ng-tags-input.js',
        '/admin/js/core/lib/jshashes.js',
        '/admin/js/core/lib/jquery.webui-popover.js'
    ]
}, {
    name: 'admin-app',
    items: [
        '/jsnbt.js',
        '/admin/js/core/app/main.js',
        '/admin/js/core/app/modules.js',
        '/admin/js/core/app/entities.js',
        '/admin/js/core/app/lists.js',
        '/admin/js/core/app/constants/TEMPLATE_BASE.js',
        '/admin/js/core/app/controllers/Controller.js',
        '/admin/js/core/app/controllers/ControllerBase.js',
        '/admin/js/core/app/controllers/ListControllerBase.js',
        '/admin/js/core/app/controllers/TreeControllerBase.js',
        '/admin/js/core/app/controllers/FormControllerBase.js',
        '/admin/js/core/app/controllers/DataListControllerBase.js',
        '/admin/js/core/app/controllers/DataFormControllerBase.js',
        '/admin/js/core/app/controllers/NodeFormControllerBase.js',
        '/admin/js/core/app/controllers/SettingsControllerBase.js',
        '/admin/js/core/app/controllers/modal/TreeSelectorModalControllerBase.js',
        '/admin/js/core/app/controllers/modal/ListSelectorModalControllerBase.js',
        '/admin/js/core/app/controllers/modal/PromptModalControllerBase.js',
        '/admin/js/core/app/controllers/modal/ConfirmModalControllerBase.js',
        '/admin/js/core/app/controllers/modal/UploadModalControllerBase.js',
        '/admin/js/core/app/controllers/modal/FormModalControllerBase.js',
        '/admin/js/core/app/controls/ControlBase.js',
        '/admin/js/core/app/controls/FormControlBase.js',
        '/admin/js/core/app/controls/ListControlBase.js',
        '/admin/js/core/app/routes/ViewRouter.js',


        '/admin/js/core/cms/main.js',

        '/admin/js/core/cms/constants/AUTH_EVENTS.js',
        '/admin/js/core/cms/constants/CONTROL_EVENTS.js',
        '/admin/js/core/cms/constants/DATA_EVENTS.js',
        '/admin/js/core/cms/constants/MODAL_EVENTS.js',
        '/admin/js/core/cms/constants/ROUTE_EVENTS.js',

        '/admin/js/core/cms/controllers/AppController.js',
        '/admin/js/core/cms/controllers/LoginController.js',
        '/admin/js/core/cms/controllers/RegistrationController.js',
        '/admin/js/core/cms/controllers/DeniedController.js',
        '/admin/js/core/cms/controllers/NotFoundController.js',
        '/admin/js/core/cms/controllers/AccountController.js',
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

        '/admin/js/core/cms/controllers/modal/ConfirmController.js',
        '/admin/js/core/cms/controllers/modal/PromptController.js',
        '/admin/js/core/cms/controllers/modal/ErrorPromptController.js',
        '/admin/js/core/cms/controllers/modal/ContainerSelectorController.js',
        '/admin/js/core/cms/controllers/modal/DataSelectorController.js',
        '/admin/js/core/cms/controllers/modal/DeletePromptController.js',
        '/admin/js/core/cms/controllers/modal/FileSelectorController.js',
        '/admin/js/core/cms/controllers/modal/FileSystemEditorController.js',
        '/admin/js/core/cms/controllers/modal/FileUploadController.js',
        '/admin/js/core/cms/controllers/modal/ImageSelectorController.js',
        '/admin/js/core/cms/controllers/modal/NodeSelectorController.js',
        '/admin/js/core/cms/controllers/modal/PasswordChangeController.js',
        '/admin/js/core/cms/controllers/modal/EmailChangeController.js',
        
        '/admin/js/core/cms/controls/form/ctrlCheck.js',
        '/admin/js/core/cms/controls/form/ctrlCheckList.js',
        '/admin/js/core/cms/controls/form/ctrlContainer.js',
        '/admin/js/core/cms/controls/form/ctrlContainerList.js',
        '/admin/js/core/cms/controls/form/ctrlCustom.js',
        '/admin/js/core/cms/controls/form/ctrlCustomList.js',
        '/admin/js/core/cms/controls/form/ctrlData.js',
        '/admin/js/core/cms/controls/form/ctrlDataList.js',
        '/admin/js/core/cms/controls/form/ctrlDatePicker.js',
        '/admin/js/core/cms/controls/form/ctrlFile.js',
        '/admin/js/core/cms/controls/form/ctrlFileList.js',    
        '/admin/js/core/cms/controls/form/ctrlHtml.js',
        '/admin/js/core/cms/controls/form/ctrlImage.js',    
        '/admin/js/core/cms/controls/form/ctrlImageList.js',
        '/admin/js/core/cms/controls/form/ctrlMap.js',
        '/admin/js/core/cms/controls/form/ctrlNode.js',
        '/admin/js/core/cms/controls/form/ctrlNodeList.js',
        '/admin/js/core/cms/controls/form/ctrlNumeric.js',
        '/admin/js/core/cms/controls/form/ctrlPassword.js',
        '/admin/js/core/cms/controls/form/ctrlSelect.js',
        '/admin/js/core/cms/controls/form/ctrlSelectList.js',
        '/admin/js/core/cms/controls/form/ctrlTags.js',
        '/admin/js/core/cms/controls/form/ctrlText.js',
        '/admin/js/core/cms/controls/form/ctrlTextArea.js',

        '/admin/js/core/cms/controls/list/ctrlGrid.js',
        '/admin/js/core/cms/controls/list/ctrlTree.js',

        '/admin/js/core/cms/controls/ctrlBreadcrumb.js',
        '/admin/js/core/cms/controls/ctrlExplorer.js',        
        '/admin/js/core/cms/controls/ctrlImageCropper.js',
        '/admin/js/core/cms/controls/ctrlScrollSpy.js',
        '/admin/js/core/cms/controls/ctrlLanguageSelector.js',
        
        '/admin/js/core/cms/panels/pnlLogin.js',
        '/admin/js/core/cms/panels/pnlRegistration.js',

        '/admin/js/core/cms/providers/$data.js',
        '/admin/js/core/cms/providers/$jsnbt.js',
        '/admin/js/core/cms/providers/$logger.js',
        '/admin/js/core/cms/providers/$queue.js',

        '/admin/js/core/cms/services/AuthService.js',
        '/admin/js/core/cms/services/FileService.js',
        '/admin/js/core/cms/services/LocationService.js',
        '/admin/js/core/cms/services/ModalService.js',
        '/admin/js/core/cms/services/PagedDataService.js',
        '/admin/js/core/cms/services/ScrollSpyService.js',
        '/admin/js/core/cms/services/TreeNodeService.js',

        '/admin/js/core/cms/utils/date.js',
        '/admin/js/core/cms/utils/gravatar.js',
        '/admin/js/core/cms/utils/tooltip.js',
        '/admin/js/core/cms/utils/popover.js',
        '/admin/js/core/cms/utils/errSrc.js',
        '/admin/js/core/cms/utils/lkRepeat.js',
        '/admin/js/core/cms/utils/ngModelTransclude.js',

        '/admin/js/init.js'
    ]
}, {
    name: 'admin-gmaps',
    items: [
        '/admin/js/core/lib/gmaps.js',
    ]
}, {
    name: 'admin-inline',
    process: false,
    items: [
         'https://maps.googleapis.com/maps/api/js'
    ]
}];