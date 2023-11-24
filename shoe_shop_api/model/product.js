const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
title: { type: String, required: true},
price: { type: Number, required: true },
brand: { type: String, required: true },
gender: { type: String, required: true },
img: [{ type: String }],
packing: [
  {
    color: { type: String },
    size: [
      {
        value: { type: String },
        remaining: {
          type: Number,
          min: 0,
          validate: {
            validator: function (value) {
              return value >= 0;
            },
            message: " Số lượng không đủ",
          },
        },
      }
    ]
  }
],
category: { type: String, required: true },
description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema );

