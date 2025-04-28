
import { Router } from "express";
import { InviteesController } from "../controllers/inviteesController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateInvitee } from "../middlewares/validationMiddleware";
import { validateIdInURLParam } from "../middlewares/validationMiddleware";

export default function inviteesRoutes(controller: InviteesController): Router {
  const router = Router();

  router.get(
    "/invitations",
    authMiddleware,
    controller.getAllInvitees.bind(controller)
  );
  router.get(
    "/invite/:id",
    authMiddleware,
    validateIdInURLParam,
    controller.getInviteeById.bind(controller)
  );
  router.post(
    "/:event_id/invite",
    authMiddleware,
    controller.createInvitee.bind(controller),
    validateInvitee
  );
  router.patch(
    "/invitees/:id",
    authMiddleware,
    validateIdInURLParam,
    controller.updateStatus.bind(controller),
    validateInvitee
  );
  router.get(
    "/event/:event_id/status",
    authMiddleware,
    controller.getGuestInsights.bind(controller)
  );

  return router;
}
