const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewere");
const Product = require("../models/product");
const User = require("../models/user");

router.get("/user/:userId/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart");
    res.render("cart/showCart", { userCart: user.cart });
  } catch (error) {
    req.flash("error", error.message);
    res.render("error");
  }
});

router.post("/user/:id/cart", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // console.log(product);
    const user = req.user;
    user.cart.push(product);
    await user.save();

    req.flash("success", "Item added into cart successfully");
    res.redirect(`/user/${req.user._id}/cart`);
  } catch (e) {
    req.flash("error", "Unable to add item into cart ");
    res.render("error");
  }
});

router.delete("/user/:userid/cart/:id", isLoggedIn, async (req, res) => {
  try {
    const { userid, id } = req.params;

    await User.findByIdAndUpdate(userid, { $pull: { cart: id } });
    req.flash("success", "Product Removed From Cart");
    res.redirect(`/user/${req.user._id}/cart`);
  } catch (error) {
    req.flash("error", "Something went wrong !!");
    res.redirect("error", e.message);
  }
});

module.exports = router;
