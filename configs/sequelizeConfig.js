const { Sequelize } = require('sequelize');
require('dotenv').config();
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

let sequelize; 

(async () => {
  try {
  
    const secret = await secretsManager.getSecretValue({
      SecretId: process.env.DB_PASS_SECRET_ID,
    }).promise();
    const secretString = JSON.parse(secret.SecretString);
    const dbPassword = secretString.password;

    
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, dbPassword, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
    });

    console.log('Sequelize instance initialized successfully.');
  } catch (error) {
    console.error('Error initializing Sequelize:', error.message, { error });
    throw new Error('Failed to initialize Sequelize');
  }
})();

module.exports = { sequelize, Sequelize };
