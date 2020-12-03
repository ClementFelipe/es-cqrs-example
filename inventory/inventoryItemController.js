const { v4: uuidV4 } = require('uuid');
const itemAggregate = require('./itemAggregate');
const { firstCommandHandler, commandHandler } = require('./commandHandler');

async function addItem(req, res) {
  const { body: { productId, initialStock } } = req;

  const command = {
    ...newCommand('AddItem'),
    productId,
    initialStock
  };

  await firstCommandHandler(itemAggregate.add, command, itemAggregate.handlers, itemAggregate.invariants, 'item');

  res.status(204).send();
}

async function updateItemStock(req, res) {
  const { body: { stock }, params: { itemId } } = req;

  const command = {
    ...newCommand('UpdateStock'),
    itemId,
    stock
  };

  await commandHandler(itemAggregate.updateStock, command, itemAggregate.handlers, itemAggregate.invariants, 'item', itemId);

  res.status(204).send();
}

async function getAllItems(req, res) {
  const { body } = req;

  res.status(204).send();
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
  addItem,
  updateItemStock,
  getAllItems,
}
