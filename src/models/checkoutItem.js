// In your CheckoutItem model file (src/models/checkoutItem.js)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CheckoutItem = sequelize.define('CheckoutItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checkout_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'checkout_items',
  timestamps: true
});

module.exports = CheckoutItem;