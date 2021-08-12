'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class groupMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      groupMember.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      groupMember.belongsTo(models.GroupChat, {
        foreignKey: 'group_id'
      });

      groupMember.belongsTo(models.Message, {
        as: 'last_message',
        foreignKey: 'last_message_id'
      });
    }
  };
  groupMember.init({
    userId: DataTypes.STRING,
    groupId: DataTypes.STRING,
    lastMessageId: DataTypes.INTEGER,
    lastMessageTimestamp: DataTypes.DATE,
  }, {
    underscored: true,
    sequelize,
    modelName: 'GroupMember',
  });
  return groupMember;
};