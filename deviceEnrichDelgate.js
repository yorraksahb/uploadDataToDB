'use strict';

var dbHelper = require('./dbhelper.js');

var envEnum = {
    DEV: 'development',
    TEST: 'test',
    PROD: 'production'
};

startOps = function(environment) {
    var tableName;
    if (environment === envEnum.DEV) {
        tableName = process.env.development;
    } else if (environment === envEnum.DEV) {
        tableName = process.env.envEnum.TEST;
    } else if (environment === envEnum.PROD) {
        tableName = process.env.envEnum.PROD;
    } else {
        return ('Environment Variables not defined');
    }


}

module.exports = {
    startOps: startOps
};