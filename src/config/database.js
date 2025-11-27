require('dotenv').config();

module.exports = {
  dialect: process.env.DIALECT_DATABASE || 'postgres',
  host: process.env.HOST || 'localhost',
  username: process.env.USERNAME_DATABASE || 'postgres',
  password: process.env.PASSWORD_DATABASE,
  database: process.env.DATABASE_NAME,
  define: {
    timestamps: true,
    underscored: true,
  },
};
