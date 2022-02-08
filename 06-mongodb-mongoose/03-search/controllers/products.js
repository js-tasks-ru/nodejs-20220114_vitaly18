const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  if (!query) return next();

  const productsRaw = await Product.find( { $text: { $search: query } } );
  const products = productsRaw.map(product => mapProduct(product));

  ctx.body = {products};
};
