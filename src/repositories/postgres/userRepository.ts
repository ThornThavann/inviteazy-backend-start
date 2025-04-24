import { Pool, QueryResult } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository } from "../../interfaces/userInterface";
import { queryWithLogging } from "./utils";

export class PostgresUserRepository implements IUserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IUser[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      "SELECT id, full_name, email FROM users"
    );
    return rows;
  }

  async findById(id: string): Promise<IUser | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      "SELECT id, full_name, email FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  }

  async create(user: Omit<IUser, "id">): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (
  full_name, email, password,
  phone_number, profile_picture, address
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, full_name, email, phone_number, profile_picture, address;`,
      [
        user.full_name,
        user.email,
        hashedPassword,
        user.phone_number ?? null,
        user.profile_picture ?? null,
        user.address ?? null,
      ]
    );
    return rows[0];
  }
}
