const express = require('express');
const { createCart, addItemToCart, changeCartItemQuantity, checkoutCart } = require('./cartServiceController');
const asyncHandler = require('express-async-handler');

require('./databaseConnection');

const app = express();

app.use(express.json());

app.post('/cart', asyncHandler(createCart));
app.post('/cart/:cartId/item', asyncHandler(addItemToCart));
app.patch('/cart/:cartId/item/:itemId', asyncHandler(changeCartItemQuantity));

app.listen(8082, () => console.log('inventory system up on port 8082'));
