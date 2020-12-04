const { firstCommandHandler, commandHandler } = require("./commandHandler");
const { v4: uuidV4 } = require('uuid');
const cartAggregate = require("./cartAggregate");

async function createCart(req, res) {
  const { body: { userId, items }, params: {} } = req;

  const command = {
    ...newCommand('CreateCart'),
    userId,
    items
  };

  await firstCommandHandler(cartAggregate.createCart, command, cartAggregate.handlers, cartAggregate.invariants, 'cart');

  res.status(200).send();
}

async function addItemToCart(req, res) {
  const { body: { productId, quantity }, params: { cartId } } = req;

  const command = {
    ...newCommand('AddItemToCart'),
    cartId,
    productId,
    quantity
  };

  await commandHandler(cartAggregate.addItemToCart, command, cartAggregate.handlers, cartAggregate.invariants, 'cart', cartId);

  res.status(200).send();
}

async function changeCartItemQuantity(req, res) {
  const { body: { quantity }, params: { cartId, itemId } } = req;

  const command = {
    ...newCommand('ChangeCartItemQuantity'),
    cartId,
    itemId,
    quantity
  };

  await commandHandler(cartAggregate.changeCartItemQuantity, command, cartAggregate.handlers, cartAggregate.invariants, 'cart', cartId);

  res.status(200).send();
}

function newCommand(type) {
  const commandId = uuidV4();

  return {
    id: commandId,
    type,
    metadata: {
      causedById: commandId,
      correlationId: uuidV4()
    }
  }
}

module.exports = {
  createCart,
  addItemToCart,
  changeCartItemQuantity
};
