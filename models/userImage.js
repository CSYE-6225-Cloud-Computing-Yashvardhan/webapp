const { DataTypes } = require('sequelize');
const database = require('../configs/sequelizeConfig');
const User = require('./user');

const Image = database.sequelize.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        readOnly: true, 
    },
    file_name: {  
        type: DataTypes.STRING,
        allowNull: false,
        readOnly: true,  
    },
    url: {  
        type: DataTypes.STRING,
        allowNull: true,
        readOnly: true, 
    },
    upload_date: {  
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
}, {
    timestamps: false
});

database.sequelize.sync();

module.exports = Image;
