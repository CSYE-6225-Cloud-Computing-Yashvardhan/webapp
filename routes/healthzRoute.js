const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/healthzController');
const { logger } = require('../utils/logger');

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};

router.use((request, response, next) => {
    if (request.method !== 'GET') {
        createLogEntry({ 
            level: 'warn', 
            event: 'API Call', 
            validationErrors: `Invalid method, Expected: GET, Received: ${request.method}`,
            url: `${request.originalUrl}` 
        });
        logger.warn(`Invalid Request: Method Not Allowed. Expected: GET, Received: ${request.method}`);
        return response.status(405).header(headers).send();
    }

    const contentLength = request.headers['content-length'];
    const isContentLengthGrtThanZero = contentLength !== undefined && contentLength !== '0';
    const isQueryParamsPresent = Object.keys(request.query).length > 0;
    const isBodyPresent = request.body && Object.keys(request.body).length > 0;
    console.log("Request Body" + request.body);
    console.log("isQueryParamsPresent " + isQueryParamsPresent);
    console.log("isBodyPresent " + isBodyPresent);
    console.log("isContentLengthGrtThanZero" + isContentLengthGrtThanZero);
    if (isQueryParamsPresent || isBodyPresent || isContentLengthGrtThanZero) {
        logger.warn("Invalid Request: Request contains payload");
        return response.status(400).header(headers).send();
    }
    next();
});

router.get('/', checkHealth);

module.exports = router;