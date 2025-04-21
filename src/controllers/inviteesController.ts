import { NextFunction, Request, Response } from "express";
import { InviteeService } from "../services/inviteesService";

export class InviteeController {
  constructor(private inviteeService: InviteeService) {}

//   Get all invitees
async getAllInvitees(req: Request, res: Response, next: NextFunction) {
  try {
    // Fetch all invitees from the service (no ID needed here)
    const result = await this.inviteeService.getAllInvitees();
    
    // Return the data as a response
    res.json({ message: "All invitees", data: result });
  } catch (error) {
    console.error("Error fetching all invitees:", (error as Error).message);
    next(error);
  }
}



  // Create invitee
  async createInvitee(req: Request, res: Response, next: NextFunction) {
    try {
      const inviteeData = req.body;
      const result = await this.inviteeService.createInvitee(inviteeData);
      res.status(201).json({ message: "Invitee created", data: result });
    } catch (error) {
      console.error("Error creating invitee:", (error as Error).message);
      next(error);
    }
  }

  // PATCH /api/v1/invitations/:inviteeId
async updateInviteeStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const inviteeId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["accept", "maybe", "no", "busy"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateResult = await this.inviteeService.updateInviteeStatus(inviteeId, status);
    if (updateResult === null || updateResult === undefined) {
      return res.status(404).json({ message: "Invitee not found" });
    }

    res.json({ message: "Invitee status updated", data: updateResult });
  } catch (error) {
    console.error("Error updating invitee status:", (error as Error).message);
    next(error);
  }
}

}
