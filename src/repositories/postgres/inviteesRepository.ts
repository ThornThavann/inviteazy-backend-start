import { Pool } from "pg";
import { Invitee } from "../../interfaces/inviteesInterfaces";

export class PostgresInviteesRepository {
  private readonly db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findAll(): Promise<Invitee[]> {
    const { rows } = await this.db.query("SELECT * FROM invitees");
    return rows;
  }

  async findById(id: string): Promise<Invitee | null> {
    const { rows } = await this.db.query("SELECT * FROM invitees WHERE id = $1", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async createInvitee(invitee: Omit<Invitee, "id">): Promise<Invitee> {
    const { event_id, user_id, status, qr_code, is_checked_in, checked_in_at } = invitee;
    const { rows } = await this.db.query(
      "INSERT INTO invitees (event_id, user_id, status, qr_code, is_checked_in, checked_in_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [event_id, user_id, status, qr_code, is_checked_in, checked_in_at]
    );
    return rows[0];
  }

  async updateStatus(inviteeId: string, status: string): Promise<void> {
    await this.db.query("UPDATE invitees SET status = $1 WHERE id = $2", [status, inviteeId]);
  }
}


// CREATE TABLE invitees (
//   id SERIAL PRIMARY KEY,
//   event_id INTEGER NOT NULL,
//   user_id INTEGER NOT NULL,
//   status VARCHAR(100),
//   qr_code TEXT,
//   is_checked_in BOOLEAN DEFAULT FALSE,
//   checked_in_at TIMESTAMP,

//   FOREIGN KEY (event_id) REFERENCES events(id),
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );