'use strict';

var AWS = require('aws-sdk'),
    fs = require('fs'),
    Promise = require('bluebird'),
    docClient = new AWS.DynamoDB.DocumentClient(),

    createRecords = function(tableName) {
        console.log("Importing device enricher into DynamoDB. Please wait.");

        return new Promise(function(resolve, reject) {
            var allData = JSON.parse(fs.readFileSync('data/enricher_dev.json', 'utf8'));
            Promise.each(allData.deviceEnricher, function(enricher) {
                    return populateTableData(enricher, tableName);
                })
                .then(function() {
                    resolve('Data Added to DB');
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    },

    populateTableData = function(enricher, table) {
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

        return docClient.put(params).promise();
    },

    getEnricherMapping = function(tableName) {
        var params = {
            TableName: tableName
        }
        return docClient.scan(params).promise();
    },

    cleanEnricherDb = function(tableName, data) {
        var dynamoDb = new AWS.DynamoDB();
        var params = {
            TableName: tableName
        };
        return dynamoDb.deleteTable(params).promise();
    },

    createEnricherDb = function(tableName) {
        var dynamoDb = new AWS.DynamoDB();
        var params = {
            TableName: tableName,
            KeySchema: [
                { AttributeName: "modelSoftwareVersion", KeyType: "HASH" } //Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "modelSoftwareVersion", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        };

        return dynamoDb.createTable(params).promise();
    };

module.exports = {
    createRecords: createRecords,
    populateTableData: populateTableData,
    getEnricherMapping: getEnricherMapping,
    cleanEnricherDb: cleanEnricherDb,
    createEnricherDb: createEnricherDb
};