import { Pool } from "pg";

export const connectPostgresDb = (): Pool => {
  const pool = new Pool({
    user: "inviteazy",
    host: "localhost",
    database: "inviteazy",
    password: "inviteazy",
    port: 5435,
  });
  return pool;
};
