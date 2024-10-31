const healthService = require("../services/healthzService");
const { logger } = require('../utils/logger');

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const checkHealth = async (request, response) => {
    logger.info(`Checking Database connection. URL: ${request.originalUrl}`);
    const isDatabaseConnected = await healthService.checkDatabaseConnection();
    if(isDatabaseConnected) {
        logger.info(`Database connection successful.`);
        return response.status(200).header(headers).send();
    } else {
        logger.error(`Database connection unsuccessful. Status: 503`);
        return response.status(503).header(headers).send();
    }
}

module.exports = {
    checkHealth,
};