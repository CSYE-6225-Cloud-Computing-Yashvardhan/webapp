const userService = require("../services/userService");
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const createUser = async (request, response) => {
    console.log("Request: " + request);
    const userData = {
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        email:request.body.email,
        password: request.body.password
    };
    console.log("userData: " + userData);
    try {
        const newUser = await userService.createUser(userData);
        if (newUser instanceof Error) {
            if(newUser.message == "User already exists") {
                return response.status(400).header(headers).send();
            }
            return response.status(500).header(headers).send();
        } 
        const responseMessage = {
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            username: newUser.username,
            account_created: newUser.account_created.toISOString(), 
            account_updated: newUser.account_updated.toISOString(), 
        };
        return response.status(201).header(headers).json(responseMessage).send();
    } catch (error) {
        console.log("User Controller: Error");
    }

};

module.exports = {
    createUser,
};