import axios from 'axios';
import Cart from '../models/cart.js';
import Checkout from '../models/checkout.js';
import CheckoutItem from '../models/checkoutItem.js';

export const createCheckout = async (req, res) => {
  try {
    const { name, accumulated_price, product_ids } = req.body;


    const checkout = await Checkout.create({
      establishment_name: name,
      total_amount: accumulated_price,
      payment_method: 'Cash',
      products: product_ids
    });


    const cartItems = await Cart.findAll();

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }


    const checkoutItemsData = cartItems.map(item => ({
      checkout_id: checkout.id,
      product_id: item.product_id,
      quantity: item.quantity
    }));

    await CheckoutItem.bulkCreate(checkoutItemsData);


    const stockUpdates = checkoutItemsData.map(item => ({
      productId: item.product_id,
      quantityChange: -item.quantity // checkout removes stock
    }));

    try {
      await axios.patch('http://localhost:3001/api/stock/change', {
        items: stockUpdates,
        checkoutId: checkout.id
      });
      console.log('✔ Stock updated');
    } catch (err) {
      console.error('❌ Could not update stock:', err.response?.data || err.message);
     
    }
    

    await Cart.destroy({ where: {} });

    res.status(201).json({
      message: 'Checkout completed successfully',
      checkoutId: checkout.id,
      items: checkoutItemsData
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};
