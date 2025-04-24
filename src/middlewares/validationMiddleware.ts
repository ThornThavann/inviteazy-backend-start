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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const idParamSchema = z.object({
  id: z.string(),
});

export const eventSchema = z.object({
  name: z.string().min(3),
  date: z.coerce.date(), // accepts a string like "2025-06-12" and converts to Date
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Time must be in HH:mm format (24-hour)",
  }),

  location: z.string(),
  description: z.string().optional(),
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

export const eventSchema = z.object({
  name: z.string().min(3),
  date: z.coerce.date(), // accepts a string like "2025-06-12" and converts to Date
  time: z.string(),       // use string here like "18:00"
  location: z.string(),
  description: z.string().optional(),
});


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
  userId: z.string().uuid(),     // the ID of the invited user
  eventId: z.string().uuid(),    // the event they're invited to
  status: z.enum(["pending", "accepted", "declined"]).optional(), // optional status
});

