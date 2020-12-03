const express = require('express');
const { client } = require('./databaseConnection');
const { createProduct, updateProduct, getAllProducts } = require('./productController');
const asyncHandler = require('express-async-handler');

client.connect(async (err) => {
  if (err) {
    console.log('error starting app');

    throw err;
  };

  const app = express();

  app.use(express.json());

  app.get('/product', asyncHandler(getAllProducts));
  app.post('/product', asyncHandler(createProduct));
  app.put('/product/:productId', asyncHandler(updateProduct));

  app.listen(8080, () => console.log('product catalogue up on port 8080'));
});

