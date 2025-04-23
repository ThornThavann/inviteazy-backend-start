import { NextFunction, Request, Response } from "express";
import redisCache from "../services/cacheService";
import { IEvent, IEventService } from "../interfaces/eventInterface";
interface AuthRequest extends Request {
  userid?: any;
}
export class EventController {
  private eventService: IEventService;

  constructor(eventService: IEventService) {
    this.eventService = eventService;
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.baseUrl, req.originalUrl);

      const result = await this.eventService.getAllEvents();
      res.json({ message: "Get all events.", data: result });
      return;
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { event_name, event_datetime, location, description } = req.body;
      // const {id} = req.userid;
      console.log('user',req.user)

      // console.log(id);
 
      // if (!id) {
      //   res.status(401).json({ message: "Unauthorized: Missing user_id" });
      //   return;
      // }
  
      const newEvent = await this.eventService.createEvent({
        event_name,
        event_datetime,
        location,
        description,
        user_id:`${req.user}`
      });
  
      res.status(201).json({ message: "A new event was created.", data: newEvent });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  
}
