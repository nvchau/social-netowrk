'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.GroupChat, { 
        foreignKey: 'author' 
      });

      User.hasMany(models.GroupMember, { 
        foreignKey: 'user_id' 
      });

      User.hasMany(models.Message, { 
        foreignKey: 'sender_id' 
      });

      User.hasMany(models.Friend, {  
        foreignKey: 'sender_id',
      });

      User.hasMany(models.Friend, { 
        foreignKey: 'receive_id'
      });
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    
  }, {
    underscored: true,
    sequelize,
    modelName: 'User',
  });
  return User;
};