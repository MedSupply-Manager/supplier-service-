import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Checkout from './checkout.js';

const CheckoutItem = sequelize.define('CheckoutItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checkout_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Checkout,
      key: 'id'
    },
    onDelete: 'CASCADE'
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

export default CheckoutItem;
