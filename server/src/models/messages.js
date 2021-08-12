'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      messages.belongsTo(models.GroupChat, {
        foreignKey: 'groupchat_id'
      });

      messages.belongsTo(models.User, {
        foreignKey: 'sender_id'
      });

      messages.hasMany(models.GroupMember, {
        foreignKey: 'last_message_id'
      });
    }
  };
  messages.init({
    groupchatId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    type: DataTypes.ENUM('text', 'image', 'emoji'),
  }, {
    underscored: true,
    sequelize,
    modelName: 'Message',
  });
  return messages;
};