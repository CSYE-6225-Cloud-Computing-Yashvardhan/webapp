const { request, response } = require("express");
const userService = require("../services/userService");
const dataValidator = require("../utils/dataValidator");
const { logger } = require('../utils/logger');
const fs = require('fs');


const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};
const createUser = async (request, response) => {
    
    logger.info(`API Call: Create User, Status: Creation Start, Url: ${request.originalUrl}, Code: 0`);
    const requestValidatorRes = await dataValidator.validateRequest(request);
    console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
    console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
    if(requestValidatorRes.validationFailed) {
        logger.error(`API Call: Create User, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: Request Validation Failed - ${requestValidatorRes.failureMessage}`);
        return response.status(400).header(headers).send(); 
    }
    logger.info(`API Call: Create User, Status: Creation In-Progress, Url: ${request.originalUrl}, Code: 0`);
    const userData = {
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        email:request.body.email,
        password: request.body.password
    };
    
    try {
        const newUser = await userService.createUser(userData);
        console.log("Create User: newUser is TypeOf" + typeof(newUser));
        console.log("Create User: " + newUser.message);
        if (newUser instanceof Error) {
            if(newUser.message == "User already exists") {
                logger.error(`API Call: Create User, Status: Creation Failed, Url: ${request.originalUrl}, Code: 400, Reason: ${newUser.message}`);
                return response.status(400).header(headers).send();
            }
            logger.error(`API Call: Create User, Status: Creation Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${newUser.message}`);
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
        logger.info(`API Call: Create User, Status: Creation Completed, Url: ${request.originalUrl}, Code: 201`);
        response.status(201).header(headers).send(responseMessage);
        userService.sendEmailVerficationLink(newUser)
        
    } catch (error) {
        logger.error(`API Call: Create User, Status: Creation Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
    }

};

const getUser = async (request, response) => {
    try {
        logger.info(`API Call: Get User, Status: Started, Url: ${request.originalUrl}, Code: 0`);
        const requestValidatorRes = await dataValidator.validateGetRequest(request);
        
        if(await dataValidator.validateRequestMethod(request, 'GET')) {
            logger.error(`API Call: Get User, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - Method Not Allowed`);
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            logger.error(`API Call: Get User, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - ${requestValidatorRes.failureMessage}`);
            return response.status(400).header(headers).send(); 
        }
        logger.info(`API Call: Get User, Status: In-Progress, Url: ${request.originalUrl}, Code: 0`);
        const userData = await userService.getUser(request.authUser.email);
        if (userData instanceof Error) {
            logger.error(`API Call: Get User, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: ${userData.message}`);
            return response.status(404).header(headers).send(); 
        }
        logger.info(`API Call: Get User, Status: Success, Url: ${request.originalUrl}, Code: 200`);
        return response.status(200).header(headers).json(userData).send();
    } catch (error) {
        logger.error(`API Call: Get User, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
        console.log("User Controller get User: Error: " + error);
    }
};

const updateUser = async (request, response) => {
    logger.info(`API Call: Update User, Status: Started, Url: ${request.originalUrl}, Code: 0`);
    const requestValidatorRes = await dataValidator.validateRequest(request);
    console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
    console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
    if(await dataValidator.validateRequestMethod(request, 'PUT')) {
        logger.error(`API Call: Update User, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - Method Not Allowed`);
        return response.status(405).header(headers).send();
    }
    if(requestValidatorRes.validationFailed) {
        logger.error(`API Call: Update User, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: Request Validation Failed - ${requestValidatorRes.failureMessage}`);
        return response.status(400).header(headers).send(); 
    }
    logger.info(`API Call: Update User, Status: In-Progress, Url: ${request.originalUrl}, Code: 0`);
    try {
        const userToBeUpdate = await userService.getUser(request.authUser.email);
        if (userToBeUpdate instanceof Error) {
            logger.error(`API Call: Update User, Status: Failed, Url: ${request.originalUrl}, Code: 404, Reason: ${userToBeUpdate.message}`);
            return response.status(404).header(headers).send(); 
        }
        if (userToBeUpdate.email !== request.body.email) {
            logger.error(`API Call: Update User, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: Email Update Not Allowed`);
            return response.status(400).header(headers).send();  
        }
        const userData = {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            password: request.body.password
        }
        const savedUser = await userService.saveUser(userToBeUpdate, userData);
        if(!savedUser) {
            logger.error(`API Call: Update User, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${savedUser.message}`);
            return response.status(500).header(headers).send();
        }
        logger.info(`API Call: Update User, Status: Success, Url: ${request.originalUrl}, Code: 204`);
        return response.status(204).header(headers).send();
    } catch (error) {
        logger.error(`API Call: Update User, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
        response.status(500).header(headers).send();
    }

};

const getUserImage = async (request, response) => {
    try {
        logger.info(`API Call: Get User Image, Status: Started, Url: ${request.originalUrl}, Code: 0`);
        const requestValidatorRes = await dataValidator.validateGetRequest(request);
        console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
        console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
        if(await dataValidator.validateRequestMethod(request, 'GET')) {
            logger.error(`API Call: Get User Image, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - Method Not Allowed`);
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            logger.error(`API Call: Get User Image, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - ${requestValidatorRes.failureMessage}`);
            return response.status(400).header(headers).send(); 
        }
        logger.info(`API Call: Get User Image, Status: In-Progress, Url: ${request.originalUrl}, Code: 0`);
        const userImage = await userService.getUserImage(request.authUser.id);
        if (userImage instanceof Error) {
            logger.error(`API Call: Get User Image, Status: Failed, Url: ${request.originalUrl}, Code: 404, Reason: ${userImage.message}`);
            return response.status(404).header(headers).send(); 
        }
        logger.info(`API Call: Get User Image, Status: Success, Url: ${request.originalUrl}, Code: 200`);
        return response.status(200).header(headers).json(userImage).send();
    } catch (error) {
        logger.error(`API Call: Get User Image, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
        console.log("User Controller get User: Error: " + error);
    }
};

const saveUserImage = async (request, response) => {
    try {
        logger.info(`API Call: Save User Image, Status: Creation Start, Url: ${request.originalUrl}, Code: 0`);
        const requestValidatorRes = await dataValidator.validateSaveUserImageRequest(request);
        console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
        console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
        if(await dataValidator.validateRequestMethod(request, 'POST')) {
            logger.error(`API Call: Save User Image, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - Method Not Allowed`);
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            logger.error(`API Call: Save User Image, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: Request Validation Failed - ${requestValidatorRes.failureMessage}`);
            return response.status(400).header(headers).send(); 
        }

        const fileContent = fs.readFileSync(request.file.path);
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${process.env.AWS_S3_BUCKET_NAME}/${request.authUser.id}/${request.file.originalname}`,
            Body: fileContent,
            ContentType: request.file.mimetype,
            Metadata: { userId: request.authUser.id.toString() }
        };
        const imageData = {
            file_name: request.file.originalname,
            user_id: request.authUser.id,
            url: params.Key
        };
        const savedUserImage = await userService.saveUserImage(params, imageData);
        if (savedUserImage instanceof Error) {
            logger.error(`API Call: Save User Image, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: ${savedUserImage.message}`);
            return response.status(400).header(headers).send(); 
        }
        logger.info(`API Call: Save User Image, Status: Success, Url: ${request.originalUrl}, Code: 200`);
        return response.status(201).header(headers).json(savedUserImage).send();
    } catch (error) {
        logger.error(`API Call: Save User Image, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
    }
};

const deleteUserImage = async (request, response) => {
    try {
        logger.info(`API Call: Delete User Image, Status: Creation Start, Url: ${request.originalUrl}, Code: 0`);
        const requestValidatorRes = await dataValidator.validateGetRequest(request);
        console.log("requestValidatorRes: " + requestValidatorRes.validationFailed);
        console.log("requestValidatorRes: " + requestValidatorRes.failureMessage);
        if(await dataValidator.validateRequestMethod(request, 'DELETE')) {
            logger.error(`API Call: Delete User Image, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - Method Not Allowed`);
            return response.status(405).header(headers).send();
        }
        if(requestValidatorRes.validationFailed) {
            logger.error(`API Call: Delete User Image, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: Request Validation Failed - ${requestValidatorRes.failureMessage}`);
            return response.status(400).header(headers).send(); 
        }

        const isDeleted = await userService.deleteUserImage(request.authUser.id);
        if (isDeleted instanceof Error) {
            logger.error(`API Call: Delete User Image, Status: Failed, Url: ${request.originalUrl}, Code: 404, Reason: ${isDeleted.message}`);
            return response.status(404).header(headers).send(); 
        }
        logger.info(`API Call: Delete User Image, Status: Success, Url: ${request.originalUrl}, Code: 200`);
        return response.status(204).header(headers).send();
    } catch (error) {
        logger.error(`API Call: Delete User Image, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
        console.log("User Controller get User: Error: " + error);
    }
};

const verifyUserEmail = async (request, response) => {
    try {
        logger.info(`API Call: Verify User, Status: Started, Url: ${request.originalUrl}, Code: 0`);
        
        if(await dataValidator.validateRequestMethod(request, 'GET')) {
            logger.error(`API Call: Verify User, Status: Failed, Url: ${request.originalUrl}, Code: 405, Reason: Request Validation Failed - Method Not Allowed`);
            return response.status(405).header(headers).send();
        }
        logger.info(`API Call: Verify User, Status: In-Progress, Url: ${request.originalUrl}, Code: 0`);
        const token = request.query.token;
        const userId = request.query.user;
        if(!token) {
            logger.error(`API Call: Verify User, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: Invalid or missing token`);
            return response.status(400).header(headers).send(); 
        }
        const result = await userService.verifyEmailToken(userId, token);
        if (result instanceof Error) {
            logger.error(`API Call: Verify User, Status: Failed, Url: ${request.originalUrl}, Code: 400, Reason: ${result.message}`);
            return response.status(400).header(headers).send(); 
        }
        const status = result.status;
        if(status === 204) {
            logger.info(`API Call: Verify User, Status: Success, Url: ${request.originalUrl}, Code: ${result.status}, Message: ${result.message} `);
        } else {
            logger.error(`API Call: Verify User, Status: Failed, Url: ${request.originalUrl}, Code: ${result.status}, Message: ${result.message} `);
        }
        return response.status(result.status).header(headers).send();
    } catch (error) {
        logger.error(`API Call: Verify User, Status: Failed, Url: ${request.originalUrl}, Code: 500, Reason: ${error}`);
    }
}


module.exports = {
    createUser,
    getUser,
    updateUser,
    getUserImage,
    saveUserImage,
    deleteUserImage,
    verifyUserEmail,
};