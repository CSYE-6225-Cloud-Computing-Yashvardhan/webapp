const healthService = require("../services/healthzService");

const checkHealth = async (request, response) => {
    const isDatabaseConnected = await healthService.checkDatabaseConnection();
    console.log("is DB connected: " + isDatabaseConnected);
    if(isDatabaseConnected) {
        return response.status(200).set('Cache-Control', 'no-cache').send();
    } else {
        return response.status(503).set('Cache-Control', 'no-cache').send();
    }
}

module.exports = {
    checkHealth,
};