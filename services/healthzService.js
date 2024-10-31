const database = require("../configs/sequelizeConfig");
const { logger } = require('../utils/logger');

const checkDatabaseConnection = async () => {
    try {
      await database.sequelize.authenticate();
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      logger.error(`Database connection failed. Error: ${error}`);
      return false;
    }
  };
  
  module.exports = {
    checkDatabaseConnection,
  };