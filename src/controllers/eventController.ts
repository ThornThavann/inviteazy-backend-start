import { NextFunction, Request, Response } from "express";
import redisCache from "../services/cacheService";
import { IEvent, IEventService } from "../interfaces/eventInterface";
interface AuthRequest extends Request {
  userid?: any;
}
export class EventController {
  private eventService: IEventService;
  getGuestInsights: any;

  constructor(eventService: IEventService) {
    this.eventService = eventService;
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = `data:${req.method}:${req.originalUrl}`;
      const cacheData = await redisCache.get(cacheKey);

      if (cacheData) {
        res.json({
          message: "Cache: Get all events",
          data: JSON.parse(cacheData),
        });
        return;
      }

      const result = await this.eventService.getAllEvents();
      await redisCache.set(cacheKey, JSON.stringify(result), 360);
      res.json({ message: "Get all events.", data: result });
      return;
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { event_name, event_datetime, location, description } = req.body;

      const newEvent = await this.eventService.createEvent({
        event_name,
        event_datetime,
        location,
        description,
        user_id: `${req.user}`,
      });

      res
        .status(201)
        .json({ message: "A new event was created.", data: newEvent });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async geteventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const cacheKey = `data:${req.method}:${req.originalUrl}`;
      const cacheData = await redisCache.get(cacheKey);

      if (cacheData) {
        res.json({
          message: "Cache: Get event by id",
          data: JSON.parse(cacheData),
        });
        return;
      }

      const result = await this.eventService.getEventById(id);
      await redisCache.set(cacheKey, JSON.stringify(result), 360);
      res.json({ message: "Get event by Id", data: result });
    } catch (error) {
      next(error);
    }
  }
}
