'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForgotPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ForgotPassword.init({
    code: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    underscored: true,
    sequelize,
    modelName: 'ForgotPassword',
  });
  return ForgotPassword;
};