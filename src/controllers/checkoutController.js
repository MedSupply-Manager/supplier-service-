const Cart = require('../models/cart');
const Checkout = require('../models/checkout');
const CheckoutItem = require('../models/checkoutItem');

// Create a new checkout
exports.createCheckout = async (req, res) => {
  try {
    const { name, family_name, phone_number, state, municipality, accumulated_price } = req.body;

    // 1️⃣ Create checkout record
    const checkout = await Checkout.create({
      name,
      family_name,
      phone_number,
      state,
      municipality,
      total_amount: accumulated_price
    });

    // 2️⃣ Get cart items
    const cartItems = await Cart.findAll();

    // 3️⃣ Save checkout items
    const checkoutItemsData = cartItems.map(item => ({
      checkout_id: checkout.id,
      product_id: item.product_id,
      quantity: item.quantity
    }));
    await CheckoutItem.bulkCreate(checkoutItemsData);

    // 4️⃣ Clear cart
    await Cart.destroy({ where: {} });

    // 5️⃣ Send response
    res.status(201).json({
      message: 'Checkout successful',
      checkout_id: checkout.id,
      items: checkoutItemsData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
