const { v4: uuidV4 } = require('uuid');

function add(command) {
  return {
    type: 'ItemAdded',
    aggregateId: uuidV4(),
    productId: command.productId,
    initialStock: command.initialStock || 0,
    allowsBackOrdering: false
  };
}

function updateStock(command, item) {
  if (command.stock === item.stock) {
    return null;
  }

  if (command.stock > item.stock) {
    return {
      type: 'StockIncreased',
      itemId: item.id,
      previousStock: item.stock,
      by: command.stock - item.stock
    };
  }

  if (command.stock === 0) {
    return {
      type: 'StockDepleted',
      itemId: item.id,
      previousStock: item.stock
    };
  }

  if (command.stock < item.stock) {
    return {
      type: 'StockDecreased',
      itemId: item.id,
      previousStock: item.stock,
      by: command.stock - item.stock
    };
  }
}

const handlers = {
  ItemAdded: (_, event) => ({
    id: event.aggregateId,
    productId: event.productId,
    stock: event.initialStock,
    allowsBackOrdering: event.allowsBackOrdering
  }),
  StockIncreased: (item, event) => ({ ...item, stock: item.stock + event.by }),
  StockDecreased: (item, event) => ({ ...item, stock: item.stock - event.by }),
  StockDepleted: (item, _) => ({ ...item, stock: 0 })
};

const invariants = {
  stockMustBeNonNegative: (item) => !item.allowsBackOrdering && item.stock < 0 ? `expected stock to be non negative but was ${item.stock}` : null
};

module.exports = {
  handlers,
  invariants,
  add,
  updateStock
};
