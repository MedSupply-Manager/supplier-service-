const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('supplies_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});
module.exports = sequelize;
