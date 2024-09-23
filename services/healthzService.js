const database = require("../configs/sequelizeConfig");

const checkDatabaseConnection = async () => {
    try {
      await database.sequelize.authenticate();
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  };
  
  module.exports = {
    checkDatabaseConnection,
  };