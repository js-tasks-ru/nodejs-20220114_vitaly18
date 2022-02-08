const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesRaw = await Category.find({});
  const categories = categoriesRaw.map(category => mapCategory(category));

  ctx.body = {categories};
};
