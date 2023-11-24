const mongoose = require("mongoose");
require('mongoose-type-email');

const userSchema = new mongoose.Schema({
  fullname: {type: String},
  username: {type: String,required: true,unique: true,},
  email: {type: mongoose.SchemaTypes.Email, unique: true},
  status: {type: Number,},
  password: { type: String, required: true },
  isAdmin: {type: Boolean,default: false},
  shipmentdetails: [
    {
      surname: { type: String, required: true },
      name: { type: String, required: true },
      address: { type: String, required: true },
      // email: { type: String, required: true },
      phone: { type: String, required: true },
      information: { type: String}
    }
  ],

},{ timestamps: true });

module.exports = mongoose.model("User", userSchema );
