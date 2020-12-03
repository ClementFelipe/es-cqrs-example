const productRepository = require('./productRepository');

async function createProduct(product) {
  const existingProduct = await productRepository.findBySKU(product.sku)

  if (existingProduct) {
    throw new Error(`product already exists with SKU ${existingProduct.sku}`);
  }

  return productRepository.create(product);
}

async function updateProduct(productId, product) {
  const existingProduct = productRepository.findById(productId)

  if (!existingProduct) {
    throw new Error(`product does not exist with id ${productId}`);
  }

  return productRepository.update(productId, product);
}

function getAllProducts() {
  return productRepository.getAll();
}

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts
};
