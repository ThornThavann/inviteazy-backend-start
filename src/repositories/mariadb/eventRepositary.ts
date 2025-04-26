import { Pool } from "mysql2/promise";
import {
  IEvent,
  IEventRepository,
  IEventWithoutId,
} from "../../interfaces/eventInterface";
import { queryWithLogging } from "./utils";

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
    const { event_name, event_datetime, location, description, user_id } = event;

    await queryWithLogging(
      this.pool,
      `INSERT INTO events (event_name, event_datetime, location, description, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [event_name, event_datetime, location, description, user_id]
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
