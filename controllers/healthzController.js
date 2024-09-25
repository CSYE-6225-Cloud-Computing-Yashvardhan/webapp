const healthService = require("../services/healthzService");
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const checkHealth = async (request, response) => {
    const isDatabaseConnected = await healthService.checkDatabaseConnection();
    console.log("is DB connected: " + isDatabaseConnected);
    if(isDatabaseConnected) {
        console.log("Database connection success");
        return response.status(200).header(headers).send();
    } else {
        console.log("Database connection unsuccessful");
        return response.status(503).header(headers).send();
    }
}

module.exports = {
    checkHealth,
};