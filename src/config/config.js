const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('supplies_db', 'root', 'Itachi12', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
