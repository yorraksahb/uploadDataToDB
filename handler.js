'use strict';
var enrichBO = require('./deviceEnrichDelgate.js'),

    handler = function(event, context, callback) {
        var env = event.table;
        console.log('Event: ' + JSON.stringify(event));

        enrichBO.startOps(env, function(err) {
            if (err) {
                return callback(JSON.stringify(err));
            } else {
                return callback('Success');
            }
        });
    };

module.exports = {
    handler: handler
};