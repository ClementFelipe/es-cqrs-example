const productService = require("./productService");

async function createProduct(req, res) {
  const { body } = req;

  const createdProduct = await productService.createProduct(body);

  res.status(200).json(createdProduct);
}

async function updateProduct(req, res) {
  const { body, params: { productId } } = req;

  const updatedProduct = await productService.updateProduct(productId, body);

  res.status(200).json(updatedProduct);
}

async function getAllProducts(req, res) {
  const products = await productService.getAllProducts();

  res.status(200).json(products);
}

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
};
