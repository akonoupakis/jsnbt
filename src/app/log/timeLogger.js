var _ = require('underscore');

var getDiff = function(earlierDate, laterDate) {
    var oDiff = new Object();

    var nTotalDiff = laterDate.getTime() - earlierDate.getTime();

    oDiff.ellapsed = {};

    oDiff.ellapsed.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
    nTotalDiff -= oDiff.ellapsed.days * 1000 * 60 * 60 * 24;

    oDiff.ellapsed.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
    nTotalDiff -= oDiff.ellapsed.hours * 1000 * 60 * 60;

    oDiff.ellapsed.minutes = Math.floor(nTotalDiff / 1000 / 60);
    nTotalDiff -= oDiff.ellapsed.minutes * 1000 * 60;

    oDiff.ellapsed.seconds = Math.floor(nTotalDiff / 1000);

    oDiff.ellapsed.milliseconds = nTotalDiff;

    var hourtext = '00';
    if (oDiff.ellapsed.days > 0) { hourtext = String(oDiff.ellapsed.days); }
    if (hourtext.length == 1) { hourtext = '0' + hourtext };

    var mintext = '00';
    if (oDiff.ellapsed.minutes > 0) { mintext = String(oDiff.ellapsed.minutes); }
    if (mintext.length == 1) { mintext = '0' + mintext };

    var sectext = '00';
    if (oDiff.ellapsed.seconds > 0) { sectext = String(oDiff.ellapsed.seconds); }
    if (sectext.length == 1) { sectext = '0' + sectext };

    var msectext = '00';
    if (oDiff.ellapsed.milliseconds > 0) { msectext = String(oDiff.ellapsed.milliseconds); }
    if (msectext.length == 1) { msectext = '0' + msectext };

    var sDuration = hourtext + ':' + mintext + ':' + sectext + ':' + msectext;
    oDiff.total = sDuration;

    return oDiff;
}

var Logger = function (name) {
    this.name = name;

    this.watches = [];

    this.startedOn = undefined;
    this.stoppedOn = undefined;
};

Logger.prototype.start = function (watchName) {
    if (watchName) {
        if (this.startedOn === undefined)
            this.startedOn = new Date();

        this.watches.push({
            name: watchName,
            startedOn: new Date(),
            stoppedOn: undefined
        });
    }
    else {
        if (this.startedOn === undefined) {
            this.startedOn = new Date();
            this.stoppedOn = undefined;
        }
    }
};

Logger.prototype.stop = function (watchName) {
    if (watchName) {
        var watch = _.find(this.watches, function (x) { return x.name === watchName; });
        if (watch)
            if (watch.stoppedOn === undefined)
                watch.stoppedOn = new Date();
    }
    else {
        this.stoppedOn = new Date();
    }
};

Logger.prototype.get = function () {
    var internalStoppedOn = this.stoppedOn || new Date();

    var diff = getDiff(this.startedOn, internalStoppedOn);

    var result = {
        name: this.name,
        startedOn: this.startedOn,
        hits: [],
        stoppedOn: internalStoppedOn,
        ellapsed: diff.ellapsed,
        total: diff.total
    };

    var sortedWatches = _.filter(this.watches, function (x) { return x.startedOn !== undefined && x.stoppedOn !== undefined; }).sort(function (a, b) {
        return a.stoppedOn - b.stoppedOn;
    });

    _.each(sortedWatches, function (watch) {
        var watchDiff = getDiff(watch.startedOn, watch.stoppedOn);
        result.hits.push({
            name: watch.name,
            startedOn: watch.startedOn,
            stoppedOn: watch.stoppedOn,
            ellapsed: watchDiff.ellapsed,
            total: watchDiff.total
        });
    });

    return result;
};

module.exports = function (name) {
    return new Logger(name);
};