import { Pool } from "mysql2/promise";
import {
  IInvitee,
  IInviteeRepository,
  IInviteeWithoutId,
} from "../../interfaces/inviteesInterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class MariaDbInviteesRepository implements IInviteeRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IInvitee[]> {
    const [rows] = await queryWithLogging<IInvitee[]>(
      this.pool,
      "SELECT * FROM invitees"
    );
    return rows;
  }

  async findById(id: string): Promise<IInvitee | null> {
    const [rows] = await queryWithLogging<IInvitee[]>(
      this.pool,
      "SELECT * FROM invitees WHERE id = ?",
      [id]
    );
    return rows[0] ?? null;
  }

  async findByEventId(event_id: string): Promise<IInvitee[]> {
    const [rows] = await queryWithLogging<IInvitee[]>(
      this.pool,
      "SELECT * FROM invitees WHERE event_id = ?",
      [event_id]
    );
    return rows;
  }

  async findByUserId(user_id: string): Promise<IInvitee[]> {
    const [rows] = await queryWithLogging<IInvitee[]>(
      this.pool,
      "SELECT * FROM invitees WHERE user_id = ?",
      [user_id]
    );
    return rows;
  }

  async create(invitee: IInviteeWithoutId): Promise<IInvitee> {
    const id = uuidv4();
    const created_at = new Date();
    const status = invitee.status || "invited"; // Default status if not provided
    const qr_code = invitee.qr_code || `https://example.com/qr/${id}`; // Default QR code if not provided
    const is_checked_in = invitee.is_checked_in ?? false; // Default to false if not provided
    const checked_in_at = invitee.checked_in_at ?? null; // Default to null if not provided

    const query = `
            INSERT INTO invitees (id, event_id, user_id, status, qr_code, is_checked_in, checked_in_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      id,
      invitee.event_id,
      invitee.user_id,
      status,
      qr_code,
      is_checked_in,
      checked_in_at,
      created_at,
    ];

    await queryWithLogging(this.pool, query, values);

    const [rows] = await queryWithLogging<IInvitee[]>(
      this.pool,
      "SELECT * FROM invitees WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  async updateStatus(id: string, status: string): Promise<IInvitee | null> {
    try {
      const [result] = await queryWithLogging(
        this.pool,
        "UPDATE invitees SET status = ? WHERE id = ?",
        [status, id]
      );

      const [rows] = await queryWithLogging<IInvitee[]>(
        this.pool,
        "SELECT * FROM invitees WHERE id = ?",
        [id]
      );
      return rows[0]; // Return the updated invitee
    } catch (error) {
      console.error("Error updating invitee status:", error);
      throw new Error("Failed to update invitee status");
    }
  }
}
