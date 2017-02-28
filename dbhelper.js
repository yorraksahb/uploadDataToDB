'use strict';

var AWS = require('aws-sdk'),
    fs = require('fs'),
    Promise = require('bluebird'),
    docClient = new AWS.DynamoDB.DocumentClient();

createRecords = function(tableName) {
    console.log("Importing device enricher into DynamoDB. Please wait.");

    var allData = JSON.parse(fs.readFileSync('data/enricher_dev.json', 'utf8'));
    console.log(allData.deviceEnricher);
    (allData.deviceEnricher).forEach(function(enricher) {
        var params = {
            TableName: tableName,
            Item: {
                'modality': enricher.modality,
                'manufacturer': enricher.manufacturer,
                'model': enricher.model,
                'modelSoftwareVersion': enricher.modelSoftwareVersion,
                'snsTopicName': enricher.snsTopicName,
                'snsTopicNamePush': enricher.snsTopicNamePush
            }
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add data", enricher.modelSoftwareVersion, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:", enricher.modelSoftwareVersion);
            }
        });

    })
}

checkTable = function(tableName) {
    var params = {
        TableName: tableName
    }

    docClient.scan(params, function(err, data) {
        if (err) {

        } else {

        }
    });
}


module.exports = {
    createRecords: createRecords,
    checkTable: checkTable
};