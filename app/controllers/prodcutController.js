const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const store = async (req, res, next) => {
  let payload = req.body;
  try {
    const category = await Category.findOne({ ct_name: payload.pd_ct_id });
    if (!category) {
      return res.status(404).json({
        error: 1,
        message: "Kategori tidak ditemukan",
      });
    }
    const product = new Product({
      pd_code: payload.pd_code,
      pd_ct_id: category._id,
      pd_name: payload.pd_name,
      pd_price: payload.pd_price,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
const update = async (req, res, next) => {
  let payload = req.body;
  let { id } = req.params;
  const category = await Category.findOne({ ct_name: payload.pd_ct_id });
  if (!category) {
    return res.status(404).json({
      error: 1,
      message: "Kategori tidak ditemukan",
    });
  }
  try {
    let product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        pd_ct_id: category._id,
        pd_name: payload.pd_name,
        pd_price: payload.pd_price,
      },
      {
        new: true,
        runValidations: true,
      }
    );
    res.json(product);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
const destroy = async (req, res, next) => {
  try {
    let product = await Product.findOneAndDelete({ _id: req.params.id });
    return res.json(product);
  } catch (error) {
    next(error);
  }
};
const show = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id }).populate(
      "pd_ct_id"
    );
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let product = await Product.find()
      .populate("pd_ct_id")
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = { store, update, destroy, index, show };
