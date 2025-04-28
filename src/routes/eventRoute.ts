import { Router } from "express";
// import { validateEvent } from "../middlewares/validationMiddleware";
import { EventController } from "../controllers/eventController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBasicEvent, validateIdInURLParam } from "../middlewares/validationMiddleware";

export default function eventRoutes(controller: EventController): Router {
  const router = Router();

  router.post(
    "/events",
    authMiddleware,
    validateBasicEvent,
    controller.createEvent.bind(controller)
  );
  router.get(
    "/events",
    authMiddleware,
    controller.getAllEvents.bind(controller)
  );
  router.get(
    "/event/:id",
    authMiddleware,
    validateIdInURLParam,
    controller.geteventById.bind(controller)
  );

  return router;
}
