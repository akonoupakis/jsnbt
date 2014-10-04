var dpdSync = require('dpd-sync');
var user = requireApp('user.js');



//console.log('auth true', data.authorize({
//    roles: ['sa']
//}, 'languages', 'C'));

//console.log('auth false', data.authorize({
//    roles: ['member']
//}, 'settings', 'R'));

//console.log('auth true', data.authorize({
//    roles: ['public']
//}, 'languages', 'R'));

//console.log('auth false', data.authorize({
//    roles: ['public']
//}, 'languages', 'C'));

//console.log('auth true', data.authorize({
//    roles: []
//}, 'tests', 'C'));

var processFn = function () {
    cancel('no enrty', 'asd');

//    var testsCount = 0;

//    console.log('--------------------');
    
//    console.log('count 1', testsCount);

//    //dpd.tests.get({}, function (results, error) {
//    //    testsCount = results.length;
//    //    console.log('count 2', testsCount);
//    //});

//    var res = dpdSync.call(dpd.tests.get, {});
//    testsCount = res.length;
//    console.log('count 3', testsCount);

//    console.log('count 4', testsCount);

//    console.log('test created: ' + this.id, dpdSync);

//    console.log('--------------------');
};

dpdSync.wrap(processFn);