const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const productsRaw = await Product.find({subcategory: subcategory});
  const products = productsRaw.map(product => mapProduct(product));

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const productsRaw = await Product.find({});
  const products = productsRaw.map(product => mapProduct(product));

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'Product ID is not in correct format.');
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.throw(404, 'Product can not be found.');
  }
  ctx.body = {product: mapProduct(product)};
};

