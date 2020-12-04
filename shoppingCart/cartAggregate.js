const { v4: uuidV4 } = require('uuid');

function createCart(command) {
  return {
    type: 'CartCreated',
    aggregateId: uuidV4(),
    userId: command.userId,
    items: command.items.map((item) => ({ ...item, id: uuidV4() }))
  };
};

function addItemToCart(command, cart) {
  return {
    type: 'ItemAddedToCart',
    cartId: cart.id,
    itemId: uuidV4(),
    productId: command.productId,
    quantity: command.quantity
  };
}

function changeCartItemQuantity(command, cart) {
  const item = cart.items[command.itemId];

  if (!item) {
    throw new Error(`item with id ${command.itemId} not found in cart ${cart.id}`);
  }

  if (command.quantity === item.quantity) {
    return null;
  }

  if (command.quantity === 0) {
    return {
      type: 'ItemRemovedFromCart',
      cartId: cart.id,
      itemId: item.id,
      previousQuantity: item.quantity
    };
  }

  if (command.quantity < item.quantity) {
    return {
      type: 'CartItemCountDecreased',
      cartId: cart.id,
      itemId: item.id,
      previousQuantity: item.quantity,
      removedQuantity: item.quantity - command.quantity
    };
  }

  return {
    type: 'CartItemCountIncreased',
    cartId: cart.id,
    itemId: item.id,
    previousQuantity: item.quantity,
    addedQuantity: command.quantity - item.quantity
  };
}

const handlers = {
  CartCreated: (_, event) => ({
    id: event.aggregateId,
    userId: event.userId,
    items: event.items.reduce((itemsMap, item) => ({
      ...itemsMap,
      [item.id]: { id: item.id ,productId: item.productId, quantity: item.quantity }
    }), {})
  }),
  ItemAddedToCart: (cart, event) => {
    cart.items[event.itemId] = {
      productId: event.productId,
      quantity: event.quantity
    };

    return cart;
  },
  ItemRemovedFromCart: (cart, event) => {
    delete cart.items[event.itemId];

    return cart;
  },
  CartItemCountDecreased: (cart, event) => {
    cart.items[event.itemId].quantity -= event.removedQuantity;

    return cart;
  },
  CartItemCountIncreased: (cart, event) => {
    cart.items[event.itemId].quantity += event.addedQuantity;

    return cart;
  }
};

const invariants = {
  itemAmountsMustBePositive: (cart) => Object.values(cart.items).every((i) => i.quantity > 0) ? null : 'expected all items to have positive quantities',
  productIdsMustBeUnique: (cart) => {
    const idSet = new Set(Object.values(cart.items).map((i) => i.productId))

    return idSet.size === Object.keys(cart.items).length ? null : 'expected all items to have unique product ids';
  }
};

module.exports = {
  createCart,
  addItemToCart,
  changeCartItemQuantity,
  handlers,
  invariants
};
