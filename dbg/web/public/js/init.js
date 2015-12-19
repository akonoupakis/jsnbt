(function () {

    "use strict";

    $(document).ready(function () {

        // on spider bot requests (e.g. from google), the page is served twice. the below checks in order for angular not to run again on prerendered content!
        if (!$('body').hasClass('rendered')) {
            angular.bootstrap(document, ['jsnbt']);
            $('body').addClass('rendered');
        }

    });

})();