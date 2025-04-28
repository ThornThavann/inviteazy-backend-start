import { Pool } from "mysql2/promise";
import bcrypt from "bcrypt";
import { IUser, IUserRepository } from "../../interfaces/userInterface";
import { queryWithLogging } from "./utils";
import { v4 } from 'uuid'; 

export class MariaDbUserRepository implements IUserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IUser[]> {
    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT id, full_name, email FROM users"
    );
    return rows;
  }

  async findById(id: string): Promise<IUser | null> {
    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT id, full_name, email FROM users WHERE id = ?",
      [id]
    );
    return rows[0] ?? null; // ✅ FIX: was `rows[0]  null`
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await queryWithLogging<IUser[]>(
      this.pool,
      "SELECT * FROM users WHERE email = ?",

      [email]
    );
    return rows[0] ?? null; // ✅ FIX: was `rows[0]  null`
  }

  async create(user: Omit<IUser, "id">): Promise<IUser> {
  // Check if user already exists
  const existingUser = await this.findByEmail(user.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const id = v4(); // Generate a new UUID for the user ID

  await queryWithLogging<any>(
    this.pool,
    `INSERT INTO users (
      id, full_name, email, password,
      phone_number, profile_picture, address
    ) VALUES (? ,?, ?, ?, ?, ?, ?)`,
    [
      id,
      user.full_name,
      user.email,
      hashedPassword,
      user.phone_number ?? null,
      user.profile_picture ?? null,
      user.address ?? null,
    ]
  );

  const [rows] = await queryWithLogging<IUser[]>(
    this.pool,
    "SELECT id, full_name, email, phone_number, profile_picture, address FROM users WHERE email = ?",
    [user.email]
  );

  return rows[0];
}

}
