const { EventStoreConnection } = require("@eventstore/db-client");

module.exports = {
  connection: EventStoreConnection.builder().insecure().defaultCredentials({ username: 'admin', password: 'changeit' }).singleNodeConnection('localhost:2113')
};
