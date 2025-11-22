const Cart = require("../models/cart");

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findAll();
    res.json(cartItems); // returns {id, product_id, quantity}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add item to cart
exports.addCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ error: "product_id and quantity required" });

    const newItem = await Cart.create({ product_id, quantity });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
