import { Router } from "express";
import { InviteeController } from "../controllers/inviteesController";

export default function inviteeRoutes(controller: InviteeController): Router {
  const router = Router();

  router.get("/invitations", controller.getAllInvitees.bind(controller));
  // router.get("/:id", (req, res, next) => {controller.getInviteeById(req, res, next).catch(next);});
  router.post("/events/:eventId/invite", controller.createInvitee.bind(controller));
  // router.patch("/:id", controller.updateInviteeStatus.bind(controller));
  router.patch("/:inviteeId/status", (req, res, next) => {
    controller.updateInviteeStatus(req, res, next).catch(next);
  });
  router.patch("/:inviteeId/status", (req, res, next) => {
    controller.updateInviteeStatus(req, res, next).catch(next);
  });
  return router;
}
