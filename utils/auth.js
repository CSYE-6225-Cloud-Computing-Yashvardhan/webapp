const bcrypt = require('bcrypt');
const userService = require("../services/userService");
const { logger } = require('../utils/logger');
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const authenticateUser = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;
        if (request.method !== 'GET' && request.method !== 'PUT' && !((request.method === 'POST' || request.method === 'DELETE') && request.originalUrl === '/v1/user/self/pic')) {
            console.log("Method not allowed - auth check");
            logger.warn(`Invalid Request: Method Not Allowed.`);
            return response.status(405).header(headers).send();
        }
        if(!authHeader || (authHeader && !authHeader.startsWith("Basic "))) {
            logger.warn(`Invalid Request: Authentication Token Missing.`);
            return response.status(401).header(headers).send();
        }
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        if (!email || !password) {
            return response.status(401).header(headers).send();
        }
        if (request.body && request.body.email && (request.body.email !== email)) {
            console.log("Email Update not allowed - auth check");
            logger.warn(`Invalid Request: Email update not allowed.`);
            return response.status(400).header(headers).send();
        }
        const userData = await userService.getUserByEmail(email);
        if(userData instanceof Error && userData.message === "Service Error") {
            logger.error(`Error in user authentication. Error: ${userData.message}`);
            return response.status(503).header(headers).send();
        }
        if (!userData || !(await bcrypt.compare(password, userData.password))) {
            logger.error(`User Authentication Failed`);
            return response.status(401).header(headers).send();
        }
        request.authUser = userData;
        next();
    } catch (error) {
        logger.error(`Error in user authentication. Error: ${error}`);
        return response.status(401).header(headers).send();
    }
    
};

module.exports = {
    authenticateUser,
}