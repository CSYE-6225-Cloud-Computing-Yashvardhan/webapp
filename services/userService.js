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

module.exports = {
    createUser,
  };