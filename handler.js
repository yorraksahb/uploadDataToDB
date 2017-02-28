'use strict';

var dbHelper = require('./dbhelper.js');
var enrichBO = require('./deviceEnrichDelgate.js');

handler = function(event, context, callback) {
    console.log(JSON.stringify(event));
    var env = event.environment;
    var httpMethod = event.httpmethod;
    var path = event.path;

    if (httpMethod === 'GET' && path === '/enricher') {
        enrichBO.startOps(env);
    } else {
        callback('Error starting the function');
    }
}

module.exports = {
    handler: handler
};