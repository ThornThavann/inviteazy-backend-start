import { Pool } from "pg";
import {
  IEvent,
  IEventRepository,
  IEventWithoutId,
} from "../../interfaces/eventInterface";
import { queryWithLogging } from "./utils";

export class PostgresEventRepository implements IEventRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IEvent[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      "SELECT id, event_name, event_datetime, location, description FROM events"
    );
    return rows;
  }
  async create(event: IEventWithoutId & { user_id: string }): Promise<IEvent> {
    const { event_name, event_datetime, location, description, user_id } =
      event;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO events (event_name, event_datetime, location, description, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, event_name, event_datetime, location, description, user_id`,
      [event_name, event_datetime, location, description, user_id]
    );

    return rows[0];
  }

  async findById(id: string): Promise<IEvent | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      "SELECT id, event_name, event_datetime, location, description FROM events WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }
}
