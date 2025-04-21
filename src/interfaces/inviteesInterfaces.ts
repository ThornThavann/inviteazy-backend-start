export interface Invitee {
    id: string;
    event_id: string;
    user_id: string;
    status: string;
    qr_code: string;
    is_checked_in: boolean;
    checked_in_at: Date | null;
    created_at: Date;
  
    // Optional nested objects if you’re populating related data
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  
    event?: {
      id: string;
      title: string;
      date: Date;
    };
  }
  
  export interface InviteesRepository {
    updateStatus(inviteeId: string, status: string): unknown;
    findAll(): Invitee[] | PromiseLike<Invitee[]>;
    findById(id: string): Invitee | PromiseLike<Invitee | null> | null;
    // findInviteesByEventId(eventId: string): Promise<Invitee[]>;
    createInvitee(invitee: Omit<Invitee, "id">): Promise<Invitee>;
  }
  