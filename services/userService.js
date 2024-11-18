const User = require("../models/user");
const UserImage = require("../models/userImage");
const EmailVerification = require("../models/emailVerification");
const { S3, sns } = require("../configs/awsConfig");
const statsdClient = require('../utils/statsD.js');
const { logger } = require('../utils/logger');
const crypto = require('crypto');



const createUser = async (userData) => {
    try {
        logger.info(`Service Call: Create User, Status: In-Progress`);
        const dbStart = Date.now();
        const isUserAlreadyExist = await User.findOne({ where: { email: userData.email } });
        console.log("isUserAlreadyExist: " + isUserAlreadyExist);
        if (isUserAlreadyExist) {
            return new Error("User already exists");
        }
        const newUser = await User.create({ 
            email: userData.email, 
            password: userData.password, 
            first_name: userData.first_name, 
            last_name: userData.last_name 
        });
        console.log("newUser: " + newUser);
        statsdClient.timing(`db.query.createUser.duration`, Date.now() - dbStart);
        logger.info(`Service Call: Create User, Status: Completed | User Email: ${newUser.email}`);
        return newUser;
    } catch (error) {
        logger.error(`Service Call: Create User, Status: Failed, Error: ${error}`);
        return new Error("Something went wrong. Error in user creation")
    }

};

const sendEmailVerficationLink = async (user) => {
    const emailSendTime = Date.now();
    const token = crypto.randomBytes(32).toString('hex');
    const message = {
        email: user.email,
        userName: `${user.first_name} ${user.last_name}`,
        domain: process.env.DOMAIN,
        userId: user.id,
        token: token,
    };

    try {

        await sns
            .publish({
                Message: JSON.stringify(message),
                TopicArn: process.env.EMAIL_VERIFICATION_SNS_ARN,
            })
            .promise();

        statsdClient.timing(`aws.sns.publish.duration`, Date.now() - emailSendTime);
        logger.info(`Verification email request sent to SNS for user: ${user.email}`);

        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        const emailRecord = await EmailVerification.create({
            user_id: user.id,
            token: token,
            expires_at: expiresAt,
        });

        logger.info(
            `Email verification record created for ID: ${emailRecord.id}, EMAIL: ${user.email}, EXP_TIME: ${emailRecord.expires_at}`
        );
    } catch (error) {
        logger.error(`Error in sendEmailVerificationLink: ${error.message}`, { error });
    }
};

const getUser = async (email) => {
    try {
        logger.info(`Service Call: Get User, Status: In-Progress`);
        const dbStart = Date.now();
        const user = await User.findOne({ 
            where: { email }, 
            attributes: { exclude: ['password'] } 
        });
        statsdClient.timing(`db.query.getUser.duration`, Date.now() - dbStart);
        logger.info(`Service Call: Get User, Status: Completed`); 
        if (user) {
            console.log("User found");
            return user;
        } else {
            console.log("User not found");
            return new Error("User Not Found");
        }
    } catch (error) {
        logger.error(`Service Call: Get User, Status: Failed, Error: ${error}`);
        return new Error("Something went wrong. Error in get user.");
    }

};

const getUserByEmail = async (email) => {
    try {
        logger.info(`Service Call: Get User By Email, Status: In-Progress`);
        const dbStart = Date.now();
        const user = await User.findOne({ where: { email } });
        statsdClient.timing(`db.query.getUserByEmail.duration`, Date.now() - dbStart);
        logger.info(`Service Call: Get User By Email, Status: Completed`); 
        if (user) {
            console.log("User found: get by email");
            return user;
        } else {
            console.log("User not found: get by email");
            return new Error("User Not Found: get by email");
        }
    } catch (error) {
        logger.error(`Service Call: Get User By Email, Status: Failed, Error: ${error}`);
        return new Error("Service Error");
    }

};

const saveUser = async (user, userData) => {
    try {
        logger.info(`Service Call: Save User, Status: In-Progress`);
        const dbStart = Date.now();
        user.set({
            first_name: userData.first_name,
            last_name: userData.last_name,
            password: userData.password
        });
        await user.save();
        statsdClient.timing(`db.query.saveUser.duration`, Date.now() - dbStart);
        logger.info(`Service Call: Save User, Status: Completed`); 
        return user;
    } catch (error) {
        logger.error(`Service Call: Save User, Status: Failed, Error: ${error}`);
        return new Error("Something went wrong. Error in save user.");
    }
};

const saveUserImage = async(params, imageData) => {
    try {
        logger.info(`Service Call: Save User Image, Status: In-Progress`);
        const dbStart1 = Date.now();
        const isImageAlreadyPresent = await getUserImage(imageData.user_id);
        statsdClient.timing(`db.query.getUserImage.duration`, Date.now() - dbStart1);
        if(!(isImageAlreadyPresent instanceof Error)) {
            logger.error(`Service Call: Save User Image, Status: Failed, Error: ${isImageAlreadyPresent.message}`);
            return new Error("Profile photo already exist");
        }
        const s3Start = Date.now();
        const imageUploadInBucket = S3.upload(params).promise();
        statsdClient.timing(`aws.s3.upload.duration`, Date.now() - s3Start);
        if(imageUploadInBucket) {
            const dbStart = Date.now();
            const savedImage = await UserImage.create({ 
                file_name: imageData.file_name,
                url: imageData.url,
                user_id: imageData.user_id
            });
            statsdClient.timing(`db.query.saveUserImage.duration`, Date.now() - dbStart);
            logger.info(`Service Call: Save User Image, Status: Completed`); 
            if (savedImage) {
                return savedImage;
            } else {
                logger.error(`Service Call: Save User Image, Status: Failed, Error: Error in database query`);
                return new Error("Error in image save to database");
            } 
        } else {
            logger.error(`Service Call: Save User Image, Status: Failed, Error: S3 Bucket image upload failed`);
            return new Error("Error in image upload to S3 bucket");
        }
    } catch (error) {
        logger.error(`Service Call: Save User Image, Status: Failed, Error: ${error}`);
        return new Error("Something went wrong. Error in upload & save user image. " + error);
    }
}

const getUserImage = async(user_id) => {
    try {
        logger.info(`Service Call: Get User Image, Status: In-Progress`);
        const dbStart = Date.now();
        const image = await UserImage.findOne({ where: { user_id } });
        statsdClient.timing(`db.query.getUserImage.duration`, Date.now() - dbStart);
        logger.info(`Service Call: Get User Image, Status: In-Progress, ${image}`); 
        if (image) {            
            return image;
        } else {
            logger.warn(`Service Call: Get User Image, Status: Failed. Reason: User Image Not Found`);
            return new Error("User Image Not Found: get by user_id");
        }
    } catch (error) {
        logger.error(`Service Call: Get User Image, Status: Failed, Error: ${error}`);
        return new Error("Something went wrong. Error in get user image. " + error);
    }
}

const deleteUserImage = async(user_id) => {
    try {
        logger.info(`Service Call: Delete User Image, Status: In-Progress`);
        const image = await UserImage.findOne({ where: { user_id } });
        if (!image) {
            console.log("User Image not found: get by user_id");
            return new Error("User Image Not Found: get by user_id");
        } 

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME, 
            Key: image.url
        };
        const s3Start = Date.now();
        const deleteResult = await S3.deleteObject(params).promise();
        statsdClient.timing('aws.s3.delete.duration', Date.now() - s3Start);

        console.log("S3 delete result:", deleteResult);
        
        const dbStart = Date.now();
        await UserImage.destroy({ where: { user_id } });
        statsdClient.timing(`db.query.deleteUserImage.duration`, Date.now() - dbStart);
        logger.info(`Service Call: Delete User Image, Status: Completed`);
        return {
            success: true
        }

    } catch (error) {
        logger.error(`Service Call: Delete User Image, Status: Failed, Error: ${error}`);
        return new Error("Something went wrong. Error in user image deletion. " + error);
    }
}

const verifyEmailToken = async (userId, token) => {
    try {
        logger.info(`Service Call: Verify Token, Status: In-Progress`);
        const verificationToken = await EmailVerification.findOne({ where: { token } });
        const userDetails = await User.findOne({ where: { id: verificationToken.user_id } })
        console.log("userId: " + userId);
        console.log("token: " + token);
        console.log("verificationTokenRecord: " + verificationToken);
        if (!verificationToken) {
            return { status: 400, message: "Invalid or expired token"};
        }
        if(!userDetails) {
            return { status: 400, message: "Invalid or expired token"}; 
        }
        if(userDetails.email_verified) {
            return { status: 409, message: "User Already Verified"};
        }
        if (verificationToken.expires_at < new Date()) {
            return { status: 410, message: "Invalid or expired token"};
        }
        
        const updateUser = await User.update({ email_verified: true }, { where: { id: verificationToken.user_id } });
        if (updateUser) {
            logger.info(`Service Call: Save User, Status: Completed`);
            return { status: 204, message: "Email Verification success"};
        } else {
            logger.error(`Service Call: Verify Token, Status: Failed`);
            return new Error("Email Verification failed. Error in user updation");
        }
    } catch (error) {
        logger.error(`Service Call: Verify Token, Status: Failed, Error: ${error}`);
        return new Error(`Error in email token verification.`);
    }
}

module.exports = {
    createUser,
    getUser,
    getUserByEmail,
    saveUser,
    saveUserImage,
    getUserImage,
    deleteUserImage,
    sendEmailVerficationLink,
    verifyEmailToken
};