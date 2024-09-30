const { DataTypes } = require('sequelize');
const database = require('../configs/sequelizeConfig');
const bcrypt = require('bcrypt');

const User = database.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        readOnly: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: " Please enter valid email address "
            },
            notEmpty: {
                msg: " Email address cannot be empty "
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:" Password cannot be empty "
            }
        },
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:" Firstname cannot be empty "
            }
        },
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:" Lastname cannot be empty "
            }
        },
    },
    account_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    account_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
            user.account_updated = new Date();
        }
    },
    timestamps: false
});

sequelize.sync();

module.exports = User;