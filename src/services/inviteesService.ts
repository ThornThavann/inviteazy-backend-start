import { Invitee, InviteesRepository } from "../interfaces/inviteesInterfaces";

export class InviteeService {
  constructor(private inviteesRepository: InviteesRepository) {}

  async getAllInvitees(): Promise<Invitee[]> {
    return this.inviteesRepository.findAll();
  }

  async createInvitee(inviteeData: Omit<Invitee, "id">): Promise<Invitee> {
    return this.inviteesRepository.createInvitee(inviteeData);
  }

  async updateInviteeStatus(inviteeId: string, status: string): Promise<void> {
    await this.inviteesRepository.updateStatus(inviteeId, status);
  }
}
