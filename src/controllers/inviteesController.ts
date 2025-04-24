import { NextFunction, Request, Response } from "express";
import {IInviteeWithoutId, IInviteeService } from "../interfaces/inviteesInterfaces";
import { InviteeService } from "../services/inviteesService";

export class InviteesController {
    // static updateStatus(arg0: string, updateStatus: any) {
    //     throw new Error('Method not implemented.');
    // }
    constructor(private inviteesService: IInviteeService) {}

    async getAllInvitees(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.inviteesService.findAll();
            res.json({ message: "Get all invitees", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getInviteeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this.inviteesService.findById(id);
            res.json({ message: "Get invitee by Id", data: result });
        } catch (error) {
            next(error);
        }
    }

    async createInvitee(req: Request, res: Response, next: NextFunction) {
        try {
            const { event_id } = req.params;
            const invitee: IInviteeWithoutId = req.body;
            const newInvitee = await this.inviteesService.create({ ...invitee, event_id });
            res.status(201).json({ message: "New invitee created", data: newInvitee });
        } catch (error) {
            next(error);
        }
    }

    // async updateInvitee(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { id } = req.params;
    //         const invitee: Partial<IInviteeWithoutId> = req.body;
    //         const updatedInvitee = await this.inviteesService.update(id, invitee);
    //         res.json({ message: "Invitee updated successfully", data: updatedInvitee });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // async deleteInvitee(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { id } = req.params;
    //         await this.inviteesService.delete(id);
    //         res.status(200).json({ message: "Invitee deleted successfully" });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
      
        try {
          // Use the instance of inviteesService
          const updatedInvitee = await this.inviteesService.updateStatus(id, status);
      
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
    
}