const express = require('express');
const { addItem, updateItemStock, getAllItems } = require('./inventoryItemController');
const asyncHandler = require('express-async-handler');

require('./databaseConnection');

const app = express();

app.use(express.json());

app.get('/item', asyncHandler(getAllItems));
app.post('/item', asyncHandler(addItem));
app.patch('/item/:itemId', asyncHandler(updateItemStock));

app.listen(8081, () => console.log('inventory system up on port 8081'));

