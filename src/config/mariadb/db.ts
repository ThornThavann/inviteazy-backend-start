import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.MARIADB_USER || "myuser",
  password: process.env.MARIADB_PASSWORD || "mypassword",   
  database: process.env.MARIADB_DATABASE || "mydb",
  port: parseInt(process.env.MDB_PORT || "3303"),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

export default connection;
