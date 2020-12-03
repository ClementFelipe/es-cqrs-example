const { Client } = require('pg');
const client = new Client();

module.exports = {
  client: new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432
  })
};
