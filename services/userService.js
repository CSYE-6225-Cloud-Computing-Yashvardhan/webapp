const User = require("../models/user");


const createUser = async (userData) => {
    try {
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
        return newUser;
    } catch (error) {
        console.log("Error in user creation. Error: " + error);
        return new Error("Something went wrong. Error in user creation")
    }

};

const getUser = async (email) => {
    try {
        const user = await User.findOne({ 
            where: { email }, 
            attributes: { exclude: ['password'] } 
        });
        if (user) {
            console.log("User found");
            return user;
        } else {
            console.log("User not found");
            return new Error("User Not Found");
        }
    } catch (error) {
        console.log("Error in get user. Error: " + error);
        return new Error("Something went wrong. Error in get user.");
    }

};

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log("User found: get by email");
            return user;
        } else {
            console.log("User not found: get by email");
            return new Error("User Not Found: get by email");
        }
    } catch (error) {
        console.log("Error in get user by email. Error: " + error);
        return new Error("Service Error");
    }

};

const saveUser = async (user, userData) => {
    try {
        user.set({
            first_name: userData.first_name,
            last_name: userData.last_name,
            password: userData.password
        });
        await user.save();
        return user;
    } catch (error) {
        console.log("Error in save user. Error: " + error);
        return new Error("Something went wrong. Error in save user.");
    }
};

module.exports = {
    createUser,
    getUser,
    getUserByEmail,
    saveUser,
  };