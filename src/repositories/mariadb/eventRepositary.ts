import { Pool } from "mysql2/promise";
import {
  IEvent,
  IEventRepository,
  IEventWithoutId,
} from "../../interfaces/eventInterface";
import { queryWithLogging } from "./utils";
import { v4 } from "uuid";

export class MariaDbEventRepository implements IEventRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IEvent[]> {
    const [rows] = await queryWithLogging<IEvent[]>(
      this.pool,
      "SELECT id, event_name, event_datetime, location, description FROM events"
    );
    return rows;
  }

  async create(event: IEventWithoutId & { user_id: string }): Promise<IEvent> {
    const { event_name, event_datetime, location, description, user_id } =
      event;
    const id = v4(); // Generate a new UUID for the user ID

    await queryWithLogging(
      this.pool,
      `INSERT INTO events (id, event_name, event_datetime, location, description, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, event_name, event_datetime, location, description, user_id]
    );

    const [rows] = await queryWithLogging<IEvent[]>(
      this.pool,
      `SELECT id, event_name, event_datetime, location, description, user_id
       FROM events
       WHERE event_name = ? AND event_datetime = ? AND user_id = ?
       ORDER BY id DESC LIMIT 1`,
      [event_name, event_datetime, user_id]
    );

    return rows[0];
  }

  async findById(id: string): Promise<IEvent | null> {
    const [rows] = await queryWithLogging<IEvent[]>(
      this.pool,
      "SELECT id, event_name, event_datetime, location, description FROM events WHERE id = ?",
      [id]
    );
    return rows[0] ?? null;
  }
}
