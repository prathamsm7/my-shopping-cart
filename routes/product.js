const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewere");
const Product = require("../models/product");
const Review = require("../models/review");
const router = express.Router();
const multer = require("multer");

const cloudinary = require("../cloudinary");
const upload = require("../multer");

//Getting all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    // console.log(products);
    res.render("products/index", { products });
  } catch (e) {
    req.flash("error", "Cannot Find Products");
    res.render("error");
  }
});

//Get new product form
router.get("/products/new", isLoggedIn, (req, res) => {
  res.render("products/new");
});

//create new product form
router.post(
  "/products",
  upload.single("file"),
  isLoggedIn,
  async (req, res) => {
    try {
      var image = req.file.path;
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        img: image,
      });
      await product.save();
      req.flash("success", "Product Added Successfully");
      res.redirect("/products");
    } catch (e) {
      // console.log(e);
      req.flash("error", "Cannot Create Products,Something is Wrong");
      res.render("error");
    }
  }
);

//Show particular product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    res.render("products/show", { product });
  } catch (e) {
    req.flash("error", "Cannot find this Product");
    res.redirect("/error");
  }
});

//Get edit form
router.get("/products/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  } catch (e) {
    req.flash("error", "Cannot Edit this Product");
    res.redirect("/error");
  }
});

//Update product
router.post(
  "/products/:id",
  upload.single("file"),
  isLoggedIn,
  async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        img: req.file.path,
      });
      req.flash("success", "Product Updated Successfully");
      res.redirect(`/products/${req.params.id}`);
    } catch (e) {
      req.flash("error", "Cannot update this Product");
      res.redirect("/error");
    }
  }
);

//Delete Product
router.delete("/products/:id", isLoggedIn, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Deleted the product successfully");
    res.redirect("/products");
  } catch (e) {
    req.flash("error", "Cannot delete this Product");
    res.redirect("/error");
  }
});

//Review Route
router.post("/products/:id/review", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const review = new Review({
      user: req.user.username,
      ...req.body,
    });

    product.reviews.push(review);

    await review.save();
    await product.save();

    // console.log(product);
    req.flash("success", "Successfully added your review!");
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    req.flash("error", "Cannot add review to this Product");
    res.redirect("/error");
  }
});

router.get("/error", (req, res) => {
  res.status(404).render("error");
});

module.exports = router;
