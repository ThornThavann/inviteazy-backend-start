import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { UserService } from "./services/userService";
import { UserController } from "./controllers/userController";
import { AuthController } from "./controllers/authController";
import { InviteesController } from "./controllers/inviteesController";
import authRoutes from "./routes/authRoutes";
import { InviteeService } from "./services/inviteesService";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import inviteesRoutes from "./routes/inviteesRoutes";
import eventRoutes from "./routes/eventRoute";
import { EventService } from "./services/eventService";
import { EventController } from "./controllers/eventController";
import { createRepositories } from "./fectory/factoryRepo";


dotenv.config();

const app = express();
const port = 3000;

const dbType = process.env.DB_TYPE || "postgres";
const { userRepository, inviteesRepository, eventRepository } =
  createRepositories(dbType);

// Services
const userService = new UserService(userRepository);

const inviteeService = new InviteeService(inviteesRepository);
const eventService = new EventService(eventRepository);

// Controllers
const userController = new UserController(userService);
const authController = new AuthController(userService);
const inviteesController = new InviteesController(inviteeService);
const eventController = new EventController(eventService);

// Middlewares
app.use(express.json());
app.use(loggingMiddleware);

// Routes

app.use("/api/users", userRoutes(userController));
app.use("/api/auth", authRoutes(authController));
app.use("/api/v1", inviteesRoutes(inviteesController));
app.use("/api/v1", eventRoutes(eventController));

// app.use("/api/invitees", inviteFireRoutes());

// Handle Errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});