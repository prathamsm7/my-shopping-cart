const mongoose = require("mongoose");
const Product = require("./product");
const moment = require("moment");
const now = moment();

const orderSchema = new mongoose.Schema({
  txnid: {
    type: String,
    required: true,
    unique: true,
  },
  orderid: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "Order Accepted",
  },
  createdAt: {
    type: String,
    default: now.format("dddd, MMMM Do YYYY, h:mm:ss a"),
  },
  updatedAt: {
    type: String,
    default: now.format("dddd, MMMM Do YYYY, h:mm:ss a"),
  },
  orderedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const order = mongoose.model("Order", orderSchema);
module.exports = order;
