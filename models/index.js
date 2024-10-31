const database = require('../configs/sequelizeConfig');
const User = require('./user');
const UserImage = require('./userImage');

User.hasMany(UserImage, { foreignKey: 'user_id' });
UserImage.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    UserImage,
};
