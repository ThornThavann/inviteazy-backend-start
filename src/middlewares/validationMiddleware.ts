import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const userSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  phone_number: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{9,10}$/.test(val), {
      message: "Worng phone number",
    }),
  profile_picture: z.string().url().optional(), // assuming it's a URL
  address: z.string().optional(),
});

export const basicEventSchema = z.object({
  id: z.string().uuid().optional(),
  event_name: z.string().min(1, "Event name is required"),
  event_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  user_id: z
    .string()
    .uuid({ message: "User ID must be a valid UUID" })
    .optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const idParamSchema = z.object({
  id: z.string(),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    userSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};

export const validateIdInURLParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    idParamSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};

export const validateInvitee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    InviteeSchema.parse(req.body);

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};

export const InviteeSchema = z.object({
  userId: z.string().uuid(), // the ID of the invited user
  eventId: z.string().uuid(), // the event they're invited to
  status: z.enum(["pending", "accepted", "declined"]).optional(), // optional status
});

export const validateBasicEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    basicEventSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    next(error);
  }
};
