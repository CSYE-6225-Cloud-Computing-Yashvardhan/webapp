require('dotenv').config();
const AWS = require('aws-sdk');
const s3 = require('aws-sdk/clients/s3')
AWS.config.update({ region: process.env.AWS_REGION });
console.log(process.env.AWS_ACCESS_KEY);
const S3 = new s3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

module.exports = S3;
