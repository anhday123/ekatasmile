const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
var S3 = require('aws-sdk/clients/s3');
const { stringHandle } = require('./utils/string-handle');
const bucketName = 'ecommercev';
const wasabiEndpoint = new AWS.Endpoint('s3.ap-northeast-1.wasabisys.com');

let uploadWSB = async (fileName, buffer) => {
    try {
        const s3 = new S3({
            endpoint: wasabiEndpoint,
            region: 'ap-northeast-1',
            accessKeyId: 'FPGND4WEL36P7YBI22RU',
            secretAccessKey: 'iRLPt3iEwt0tCQf1rOLueI0fPAzjHsFwcd3K70e6',
        });
        fileName = stringHandle(fileName, { createSlug: true });
        await s3.putObject({
            Body: fileName,
            Bucket: bucketName,
            Key: buffer,
            ACL: 'public-read',
        });

        let uniqueKey =
            new Date().getTime() + String(Math.random()).substring(2, 6) + String(Math.random()).substring(2, 6);
        return `https://s3.ap-northeast-1.wasabisys.com/${bucketName}/${uniqueKey}/${fileName}`;
    } catch (err) {
        throw err;
    }
};

(async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'utf-8');
    let result = await uploadWSB(`sản phẩm 1`, buffer);
    console.log(result);
})('https://i.pinimg.com/564x/62/ed/6e/62ed6ea71018a57a3ab0c8c959d78cb0.jpg');
