const { client } = require('./databaseConnection');

async function findById(productId) {
  const result = await client.query('select * from product where id = $1', [productId]);

  return result.rowCount > 0 ? result.rows : null;
}

async function findBySKU(productSKU) {
  const result = await client.query('select * from product where sku = $1', [productSKU]);

  return result.rowCount > 0 ? result.rows : null;
}

async function create(product) {
  const result = await client.query('insert into product (name, sku, description, price) values ($1, $2, $3, $4) returning *', [product.name, product.sku, product.description, product.price]);

  return result.rows[0];
}

async function update(productId, product) {
  const result = await client.query('update product set name=$2, sku=$3, description=$4, price=$5 where id = $1 returning *', [productId, product.name, product.sku, product.description, product.price]);

  return result.rows[0];
}

async function getAll() {
  const result = await client.query('select * from product');

  return result.rows;
}

module.exports = {
  findById,
  findBySKU,
  getAll,
  create,
  update,
}