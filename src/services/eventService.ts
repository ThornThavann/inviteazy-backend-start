import {
  IEvent,
  IEventRepository,
  IEventService,
  IEventWithoutId,
} from "../interfaces/eventInterface";

export class EventService implements IEventService {
  constructor(private eventRepository: IEventRepository) {}

  async getAllEvents(): Promise<IEvent[]> {
    return await this.eventRepository.findAll();
  }

  async getEventById(id: string): Promise<IEvent> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw Object.assign(new Error("Event not found"), { status: 404 });
    }
    return event;
  }

  async createEvent(event: IEventWithoutId): Promise<{ event: IEvent }> {
    const newEvent = await this.eventRepository.create(event);

    return { event: newEvent };
  }
}
