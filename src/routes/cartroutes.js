const express = require('express');
const router = express.Router();
const { getCartItems, addCartItem } = require('../controllers/cartController');

<<<<<<< HEAD
router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.findAll();
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const newCartItem = await Cart.create({ product_id, quantity });
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

=======
router.get("/", getCartItems);
router.post("/", addCartItem);

>>>>>>> d295d75 (added the route and control for the cart logic and checkout logic it's not fully lunchable tho)
module.exports = router;
