const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Just store the product id from Product Service
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'cart_items',
  timestamps: true
});

module.exports = Cart;
