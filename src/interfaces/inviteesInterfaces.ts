export interface IInvitee {
  id?: string;
  event_id: string; 
  user_id: string; 
  status: 'invited' | 'accepted' | 'maybe' | 'no' | 'busy'; 
  qr_code: string;
  is_checked_in: boolean; 
  checked_in_at: Date | null; 
  created_at?: Date;
}

export interface IInviteeWithoutId extends Omit<IInvitee, 'id' | 'created_at'> {
  event_id: string; 
  status: 'invited' | 'accepted' | 'maybe' | 'no' | 'busy'; 
  qr_code: string;
  is_checked_in: boolean; 
  checked_in_at: Date | null;
}


export interface IInviteeRepository {
  findAll(): Promise<IInvitee[]>;
  findById(id: string): Promise<IInvitee | null>;
  findByEventId(event_id: string): Promise<IInvitee[]>;
  findByUserId(user_id: string): Promise<IInvitee[]>;
  create(invitee: IInviteeWithoutId): Promise<IInvitee>;
  // update(id: string, invitee: Partial<IInviteeWithoutId>): Promise<IInvitee | null>;
  // delete(id: string): Promise<void>;
}

export interface IInviteeService extends IInviteeRepository {
    updateStatus(id: string, status: string): IInvitee | PromiseLike<IInvitee | null> | null;
}