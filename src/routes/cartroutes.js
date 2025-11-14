const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

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