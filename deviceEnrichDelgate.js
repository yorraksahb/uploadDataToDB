'use strict';

var dbHelper = require('./dbhelper.js');

var envEnum = {
        DEV: 'development',
        TEST: 'test',
        PROD: 'production'
    },

    startOps = function(environment, cb) {
        var tableName;
        if (environment === envEnum.DEV) {
            tableName = process.env.development;
        } else if (environment === envEnum.DEV) {
            tableName = process.env.envEnum.TEST;
        } else if (environment === envEnum.PROD) {
            tableName = process.env.envEnum.PROD;
        } else {
            return ('Environment Variables not defined');
        };


        var deffered = dbHelper.describeTableStatus(tableName)
            .then(function(data){
                if(true) {
                    dbHelper.getEnricherMapping(tableName)
                        .then(function(data) {
                            console.log('getEnricherMapping: ' + data);
                                if (data.Count > 0) {
                                    return dbHelper.cleanEnricherDb(tableName)
                                        .then(function(data) {
                                            console.log('cleanEnricherDb: ', data);
                                            return dbHelper.createEnricherDb(tableName)
                                                .then(function(data) {
                                                    console.log('createEnricherDb: ', data);
                                                    return dbHelper.createRecords(tableName);
                                                });
                                        });
                                } else {
                                            return dbHelper.createRecords(tableName);
                                    }
                        })
                } else {
                    //Table doesn't exists, now create the table and createRecords
                }
            })
            dbHelper.getEnricherMapping(tableName)
                .then(function(data) {
                    console.log('getEnricherMapping: ', data);
                    if (data.Count > 0) {
                        //Clean the DB
                        return dbHelper.cleanEnricherDb(tableName)
                            .then(function(data) {
                                console.log('cleanEnricherDb: ', data);
                                return dbHelper.createEnricherDb(tableName)
                                    .then(function(data) {
                                        console.log('createEnricherDb: ', data);
                                        return dbHelper.createRecords(tableName);
                                    });
                            });
                    } else {
                        return dbHelper.createEnricherDb(tableName)
                            .then(function(data) {
                                return dbHelper.createRecords(tableName);
                            })
                    }
            }).catch(function(err) {
                return cb({ message: 'Error : ' + JSON.stringify(err) }); //Return the error to the console
            });
        return deffered.promise;
    };

module.exports = {
    startOps: startOps
};