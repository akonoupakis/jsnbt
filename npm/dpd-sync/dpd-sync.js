var wait = require('wait.for');

// wrap a function for a fiber use
// note: best for this method to be invoked on request.
exports.wrap = function () {
    wait.launchFiber.apply(wait.launchFiber, arguments);
};

var getFn = function () {
    var fn = arguments[0];
    var paramsIntenal = [];

    for (var indexInternal in arguments) {
        if (indexInternal > 0 && indexInternal < (arguments.length - 1))
            paramsIntenal.push(arguments[indexInternal]);
    }

    var callback = arguments[arguments.length - 1];
    paramsIntenal.push(function (results, error) {
        callback(error, results);
    });

    fn.apply(fn, paramsIntenal);
}

exports.call = function () {
    var argsInternal = [];
    argsInternal.push(getFn);

    for (var indexInternal in arguments) {
        argsInternal.push(arguments[indexInternal]);
    }

    return wait.for.apply(wait.for, argsInternal);
};