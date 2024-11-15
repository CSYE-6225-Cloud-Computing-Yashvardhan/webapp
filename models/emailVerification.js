
const { DataTypes } = require('sequelize');
const database = require('../configs/sequelizeConfig');
const User = require('./user');

const EmailVerification = database.sequelize.define("EmailVerification", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        readOnly: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        readOnly: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

database.sequelize.sync();

module.exports = EmailVerification;