const Cart = require("../model/cart");
const express = require('express').Router();
const router = require("express").Router();

router.post("/add", async (req, res) => {
    const newCart = new Cart(req.body);
  
    try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

  router.put("/:id",async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.id);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete("/deletecartId/:id", async (req, res) => {
    try {
      const deletedCart = await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json(deletedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete("/delete/:userId", async (req, res) => {
    try {
      console.log(req.body)
      const deletedCart = await Cart.findOneAndDelete({ userId: req.params.userId });
      if (!deletedCart) {
        return res.status(404).json({ message: "Cart không tồn tại" });
      }
      res.status(200).json({ message: "Cart đã bị xóa thành công" });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/find/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.query;
      let query = { userId };
  
      if (status) {
        query = { ...query, status };
      }
  
      const carts = await Cart.find(query);
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  }); 
  router.put("/find/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { products } = req.body;
  
      // Find the cart by userId
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      cart.products = products;
  
      const savedCart = await cart.save();
  
      res.status(200).json(savedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//all
  router.get("/",  async (req, res) => {
    try {
      const carts = await Cart.find({});
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

 
module.exports = router;