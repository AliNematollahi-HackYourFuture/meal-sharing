import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const db = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export default db;
