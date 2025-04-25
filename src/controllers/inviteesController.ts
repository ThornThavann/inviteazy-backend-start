import { NextFunction, Request, Response } from "express";
import {
  IInviteeWithoutId,
  IInviteeService,
} from "../interfaces/inviteesInterfaces";
import redisCache from "../services/cacheService";

export class InviteesController {
  constructor(private inviteesService: IInviteeService) {}

  async getAllInvitees(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = `data:${req.method}:${req.originalUrl}`;
      const cacheData = await redisCache.get(cacheKey);

      if (cacheData) {
        res.json({
          message: "Cache: Get all invitees",
          data: JSON.parse(cacheData),
        });
        return;
      }

      const result = await this.inviteesService.findAll();
      await redisCache.set(cacheKey, JSON.stringify(result), 360);
      res.json({ message: "Get all invitees", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getInviteeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const cacheKey = `data:${req.method}:${req.originalUrl}`;
      const cacheData = await redisCache.get(cacheKey);

      if (cacheData) {
        res.json({
          message: "Cache: Get invitee by Id",
          data: JSON.parse(cacheData),
        });
        return;
      }

      const result = await this.inviteesService.findById(id);
      await redisCache.set(cacheKey, JSON.stringify(result), 360);
      res.json({ message: "Get invitee by Id", data: result });
    } catch (error) {
      next(error);
    }
  }

  async createInvitee(req: Request, res: Response, next: NextFunction) {
    try {
      const { event_id } = req.params;
      const invitee: IInviteeWithoutId = req.body;
      const newInvitee = await this.inviteesService.create({
        ...invitee,
        event_id,
      });
      res
        .status(201)
        .json({ message: "New invitee created", data: newInvitee });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updatedInvitee = await this.inviteesService.updateStatus(
        id,
        status
      );

      if (!updatedInvitee) {
        res.status(404).json({ message: "Invitee not found" });
      }

      res.status(200).json({
        message: "Status updated",
        invitee: updatedInvitee,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "Error updating status",
        error: err.message,
      });
    }
  }

  async getGuestInsights(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const event_id = req.params.event_id;
      const insights = await this.inviteesService.findByEventId(event_id);

      const statusCounts = {
        totalInvited: insights.length,
        accepted: 0,
        no: 0,
        maybe: 0,
        totalContribution: 0,
      };

      for (const invitee of insights) {
        switch (invitee.status) {
          case "accepted":
            statusCounts.accepted++;
            break;
          case "maybe":
            statusCounts.maybe++;
            break;
          default:
            statusCounts.maybe++;
        }

        if (invitee.is_checked_in) {
          statusCounts.no++;
        }
      }

      res.status(200).json({ data: statusCounts });
    } catch (error) {
      console.error("Error fetching guest insights:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
