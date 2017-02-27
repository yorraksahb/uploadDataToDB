var dbHelper = require('./dbhelper.js');

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event));
    var env = event.environment;
    var httpMethod = event.httpmethod;
    var path = event.path;

    if (httpMethod === 'GET' && path === '/enricher') {
        dbHelper.executeDbOps(env);
    }
}