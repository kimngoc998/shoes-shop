const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: {type: String},
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        body: {type: String},
        parentId: {type: String},
      },
      { timestamps: true }
    );

module.exports = mongoose.model("Comment", commentSchema );

