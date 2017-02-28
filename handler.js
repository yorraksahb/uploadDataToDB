'use strict';
var enrichBO = require('./deviceEnrichDelgate.js'),

    handler = function(event, context, callback) {
        console.log(JSON.stringify(event));
        var env = event.environment;
        var httpMethod = event.httpmethod;
        var path = event.path;

        if (httpMethod === 'GET' && path === '/enricher') {
            enrichBO.startOps(env, function(err) {
                if (err) {
                    return callback(JSON.stringify(err));
                } else {
                    return callback('Success');
                }
            });
        } else {
            return callback('Error starting the function');
        }
    };

module.exports = {
    handler: handler
};