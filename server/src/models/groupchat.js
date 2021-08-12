'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class groupChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      groupChat.belongsTo(models.User, {
        foreignKey: 'author'
      });

      groupChat.hasMany(models.GroupMember, {
        foreignKey: 'group_id'
      });

      groupChat.hasMany(models.Message, {
        foreignKey: 'groupchat_id'
      });
    }
  };
  groupChat.init({
    name: DataTypes.STRING,
    author: DataTypes.INTEGER
  }, {
    underscored: true,
    sequelize,
    modelName: 'GroupChat',
  });
  return groupChat;
};