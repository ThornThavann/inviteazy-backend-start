export interface IEvent {
    id?: string;
    event_name: string;
    event_datetime: string;
    location: string;
    description?: string; 
    user_id: string,
    created_at?: string; // ISO timestamp
    updated_at?: string; // ISO timestamp
  }
  
  export interface IEventWithoutId extends Omit<IEvent, 'id'> {}
  
  export interface IEventRepository {
    findAll(): Promise<IEvent[]>;
    findById(id: string): Promise<IEvent | null>;
    create(event: IEventWithoutId): Promise<IEvent>;
    
  }
  
  export interface IEventService {
    getAllEvents(): Promise<IEvent[]>;
    getEventById(id: string): Promise<IEvent>;
    createEvent(
      event: IEventWithoutId
    ): Promise<{ event: IEvent }>
  }
  