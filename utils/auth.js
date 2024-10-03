const bcrypt = require('bcrypt');
const userService = require("../services/userService");
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const authenticateUser = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;
        if (request.method !== 'GET' && request.method !== 'PUT') {
            console.log("Method not allowed - auth check");
            return response.status(405).header(headers).send();
        }
        if(!authHeader || (authHeader && !authHeader.startsWith("Basic "))) {
            console.log("Auth Token Missing");
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
            return response.status(400).header(headers).send();
        }
        const userData = await userService.getUserByEmail(email);
        if(userData instanceof Error && userData.message === "Service Error") {
            return response.status(503).header(headers).send();
        }
        if (!userData || !(await bcrypt.compare(password, userData.password))) {
            return response.status(401).header(headers).send();
        }
        request.authUser = userData;
        next();
    } catch (error) {
        console.log("Error in user authentication: " + error);
        return response.status(401).header(headers).send();
    }
    
};

module.exports = {
    authenticateUser,
}