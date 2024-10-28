const { request, response } = require("express");
const userService = require("../services/userService");
const dataValidator = require("../utils/dataValidator");
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const createUser = async (request, response) => {
    console.log("Request: " + request.toString());
    const requestValidatorRes = await dataValidator.validateRequest(request);
    console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
    console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
    if(requestValidatorRes.validationFailed) {
        return response.status(400).header(headers).send(); 
    }
    const userData = {
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        email:request.body.email,
        password: request.body.password
    };
    console.log("userData: " + userData);
    try {
        const newUser = await userService.createUser(userData);
        console.log("Create User: newUser is TypeOf" + typeof(newUser));
        console.log("Create User: " + newUser.message);
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
            email: newUser.email,
            account_created: newUser.account_created.toISOString(), 
            account_updated: newUser.account_updated.toISOString(), 
        };
        return response.status(201).header(headers).send(responseMessage);
    } catch (error) {
        console.log("User Controller: Error");
    }

};

const getUser = async (request, response) => {
    try {
        console.log("Request: " + request.toString());
        const requestValidatorRes = await dataValidator.validateGetRequest(request);
        console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
        console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
        if(await dataValidator.validateRequestMethod(request, 'GET')) {
            console.log("Method not allowed - validateRequestMethod");
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            return response.status(400).header(headers).send(); 
        }

        const userData = await userService.getUser(request.authUser.email);
        if (userData instanceof Error) {
            return response.status(404).header(headers).send(); 
        }
        return response.status(200).header(headers).json(userData).send();
    } catch (error) {
        console.log("User Controller get User: Error: " + error);
    }
};

const updateUser = async (request, response) => {
    console.log("Request: " + request.toString());
    const requestValidatorRes = await dataValidator.validateRequest(request);
    console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
    console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
    if(await dataValidator.validateRequestMethod(request, 'PUT')) {
        console.log("Method not allowed - validateRequestMethod");
        return response.status(405).header(headers).send();
    }
    if(requestValidatorRes.validationFailed) {
        return response.status(400).header(headers).send(); 
    }
    try {
        const userToBeUpdate = await userService.getUser(request.authUser.email);
        if (userToBeUpdate instanceof Error) {
            return response.status(404).header(headers).send(); 
        }
        if (userToBeUpdate.email !== request.body.email) {
            console.log("Email Update not allowed");
            return response.status(400).header(headers).send();  
        }
        const userData = {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            password: request.body.password
        }
        const savedUser = await userService.saveUser(userToBeUpdate, userData);
        if(!savedUser) {
            return response.status(500).header(headers).send();
        }
        return response.status(204).header(headers).send();
    } catch (error) {
        console.log("Error in user controller.");
        response.status(500).header(headers).send();
    }

};

const getUserImage = async (request, response) => {
    try {
        console.log("Request: " + request.toString());
        const requestValidatorRes = await dataValidator.validateGetRequest(request);
        console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
        console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
        if(await dataValidator.validateRequestMethod(request, 'GET')) {
            console.log("Method not allowed - validateRequestMethod");
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            return response.status(400).header(headers).send(); 
        }

        const userImage = await userService.getUserImage(request.authUser.id);
        if (userImage instanceof Error) {
            return response.status(404).header(headers).send(); 
        }
        return response.status(200).header(headers).json(userImage).send();
    } catch (error) {
        console.log("User Controller get User: Error: " + error);
    }
};

const saveUserImage = async (request, response) => {
    try {
        console.log("Request: " + request.toString());
        const requestValidatorRes = await dataValidator.validateGetRequest(request);
        console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
        console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
        if(await dataValidator.validateRequestMethod(request, 'POST')) {
            console.log("Method not allowed - validateRequestMethod");
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            return response.status(400).header(headers).send(); 
        }

        const userImage = await userService.getUserImage(request.authUser.id);
        if (userImage instanceof Error) {
            return response.status(404).header(headers).send(); 
        }
        return response.status(200).header(headers).json(userImage).send();
    } catch (error) {
        console.log("User Controller get User: Error: " + error);
    }
};


module.exports = {
    createUser,
    getUser,
    updateUser,
    getUserImage,
    saveUserImage,
};