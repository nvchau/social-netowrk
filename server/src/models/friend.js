'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friend.belongsTo(models.User, {
        foreignKey: 'sender_id',
        foreignKey: 'receive_id'
      });

      Friend.belongsTo(models.User, {
        as: 'sender',
        foreignKey: 'sender_id'
      });
      
      Friend.belongsTo(models.User, {
        as: 'receiver',
        foreignKey: 'receive_id'
      });
    }
  };
  Friend.init({
    senderId: DataTypes.INTEGER,
    receiveId: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    underscored: true,
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};