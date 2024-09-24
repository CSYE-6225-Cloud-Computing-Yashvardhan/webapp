const healthService = require("../services/healthzService");

const checkHealth = async (request, response) => {
    const isDatabaseConnected = await healthService.checkDatabaseConnection();
    console.log("is DB connected: " + isDatabaseConnected);
    if(isDatabaseConnected) {
        console.log("Database connection success");
        return response.status(200).header('Cache-Control', 'no-cache').send();
    } else {
        console.log("Database connection unsuccessful");
        return response.status(503).header('Cache-Control', 'no-cache').send();
    }
}

module.exports = {
    checkHealth,
};