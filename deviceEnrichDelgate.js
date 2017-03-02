'use strict';

var dbHelper = require('./dbhelper.js'),
    startOps = function(environment, cb) {
        var tableName = environment;
        var deffered = dbHelper.describeTableStatus(tableName)
            .then(function(data) {
                if (data) {
                    dbHelper.getEnricherMapping(tableName)
                        .then(function(data) {
                            console.log('getEnricherMapping: ' + JSON.stringify(data));
                            if (data.Count > 0) {
                                return dbHelper.cleanEnricherDb(tableName)
                                    .then(function(data) {
                                        console.log('cleanEnricherDb: ', data);
                                        return dbHelper.waitForTableDelete(tableName)
                                            .then(function(data){
                                                console.log('waitForTableDelete: ', data);
                                                return dbHelper.createEnricherDb(tableName)
                                                    .then(function(data){
                                                        console.log('createEnricherDb: ', data);
                                                        return dbHelper.waitForTableCreate(tableName)
                                                            .then(function(data){
                                                                console.log('createEnricherDb: ', data);
                                                                return dbHelper.createRecords(tableName);
                                                            });
                                                    });
                                            });
                                    });
                            } else {
                                return dbHelper.createRecords(tableName);
                            }
                        })
                } else {
                    //Table doesn't exists, now create the table and createRecords
                    console.log('If db not created ' + data);
                    return dbHelper.createEnricherDb(tableName)
                        .then(function(data) {
                            console.log('Table Not Exists Creating ' + data);
                            return dbHelper.waitForTableCreate(tableName)
                                .then(function(data){
                                    console.log('Creating records now '+ data);
                                    return dbHelper.createRecords(tableName);  
                                });
                        });
                }
            }).catch(function(err) {
                return cb({ message: 'Error : ' + JSON.stringify(err) }); //Return the error to the console
            });
        return deffered.promise;
    };

module.exports = {
    startOps: startOps
};