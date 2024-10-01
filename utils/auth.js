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
        if(!authHeader || !authHeader.startsWith("Basic ")) {
            response.status(401).header(headers).send();
        }
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        if (!email || !password) {
            return response.status(401).header(headers).send();
        }
        const userData = await userService.getUserByEmail(email);
        if (userData instanceof Error || !userData || !(await bcrypt.compare(password, userData.password))) {
            return response.status(401).header(headers).send();
        }
        request.authUser = userData;
        next();
    } catch (error) {
        console.log("Error in user authentication");
        return response.status(401).header(headers).send();
    }
    
};

module.exports = {
    authenticateUser,
}