import { Router } from "express";
import { validateEvent } from "../middlewares/validationMiddleware";
import { EventController } from "../controllers/eventController";
import { authMiddleware } from "../middlewares/authMiddleware";

export default function eventRoutes(controller: EventController): Router {
  const router = Router();

  router.post(
    "/events",
    authMiddleware, 
    controller.createEvent.bind(controller) // Controller action to create event
  );
  return router;
}
