const DataTypes = require('sequelize');
const sequelize = require('../config/database');
const Product = require('../../../../e_commerce/backend/models/product');

const Checkout = sequelize.define('Checkout', {
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
      ProductId: {
        type: DataTypes.INTEGER,
        references: {
          model: Product,
          key: 'id'
        },
        allowNull: false
      }
    }, {tableName: 'checkouts'} 
);
module.exports = Checkout;




