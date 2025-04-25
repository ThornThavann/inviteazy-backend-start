import { NextFunction, Request, Response } from "express";
import { IInvitee, IInviteeService } from "../interfaces/inviteesInterfaces";

export class GuestInsightController {
  constructor(private inviteeService: IInviteeService) {}

  async getGuestInsights(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const event_id = req.params.event_id;
      const insights = await this.inviteeService.findByEventId(event_id);

      const statusCounts = {
        totalInvited: insights.length,
        confirmed: 0,
        attended: 0,
        pending: 0,
        totalContribution: 0,
      };

      for (const invitee of insights) {
        switch (invitee.status) {
          case "accepted":
            statusCounts.confirmed++;
            break;
          case "maybe":
            statusCounts.pending++;
            break;
          default:
            statusCounts.pending++;
        }

        if (invitee.is_checked_in) {
          statusCounts.attended++;
        }
      }

      res.status(200).json({ data: statusCounts });
    } catch (error) {
      console.error("Error fetching guest insights:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
