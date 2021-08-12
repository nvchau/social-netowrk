'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Reaction.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    type: DataTypes.INTEGER
  }, {
    underscored: true,
    sequelize,
    modelName: 'Reaction',
  });
  return Reaction;
};