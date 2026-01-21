const { Pool } = require('pg');
require('dotenv').config();

const connection = new Pool({
  user: process.env.USERNAME_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  host: process.env.HOST,
  port: 5432,
  database: process.env.DATABASE_NAME,
});

module.exports = connection;