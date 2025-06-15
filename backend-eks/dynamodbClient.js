const AWS = require("aws-sdk");

AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE || "todos";

module.exports = { dynamodb, TABLE_NAME };
