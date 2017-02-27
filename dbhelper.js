var AWS = require('aws-sdk');
var fs = require('fs');

var envEnum = {
    DEV: 'development',
    TEST: 'test',
    PROD: 'production'
};

function executeDbOps(environment) {

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

    var docClient = new AWS.DynamoDB.DocumentClient();

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

exports.executeDbOps = executeDbOps;