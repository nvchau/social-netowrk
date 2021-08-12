const { Sequelize } = require('sequelize');
require('dotenv').config();
const Env = process.env

const sequelize = new Sequelize(`${Env.DATABASE}`, 'root', `${Env.PASSWORD}`, {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connect database success');
    } catch (error) {
        console.error('Connection database failed:', error);
    }
}




