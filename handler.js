'use strict';
var enrichBO = require('./deviceEnrichDelgate.js'),

    handler = function(event, context, callback) {
        console.log(JSON.stringify(event));
        var env = event.table;
        var httpMethod = event.httpmethod;
        var path = event.path;
        console.log('Event: ' + JSON.stringify(event));

        enrichBO.startOps(env, function(err) {
            if (err) {
                return callback(err);
            } else {
                return callback('Success');
            }
        });

        /*if (httpMethod === 'GET' && path === '/enricher') {
            enrichBO.startOps(env, function(err) {
                if (err) {
                    return callback(JSON.stringify(err));
                } else {
                    return callback('Success');
                }
            });
        } else {
            return callback('Error starting the function');
        } */
    };

module.exports = {
    handler: handler
};