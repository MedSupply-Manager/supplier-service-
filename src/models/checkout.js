const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Checkout = sequelize.define('Checkout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  establishment_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('Credit Card', 'Debit Card', 'PayPal', 'Cash'),
    allowNull: false
  },
  product_ids: {
    type: DataTypes.JSON, // Store array of product ids
    allowNull: false
  }
}, {
  tableName: 'checkouts',
  timestamps: true
});

module.exports = Checkout;
