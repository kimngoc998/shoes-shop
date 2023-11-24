const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        products: [{
            productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number},
            color: {type: String},
            size: {type: Number},
            img: {type: String},
            price: {type: Number},
            title: {type: String}
          }],
        status: { type: String, default: "pending" },
      },
      { timestamps: true }
    );

module.exports = mongoose.model("Cart", cartSchema );

