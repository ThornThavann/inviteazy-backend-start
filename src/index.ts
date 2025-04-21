import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoute";
import inviteeRoutes from "./routes/inviteesRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import { connectPostgresDb } from "./config/postgresdb/db";
import { PostgresUserRepository } from "./repositories/postgres/userRepository";
import { PostgresEventRepository } from "./repositories/postgres/eventRepositary";
import { PostgresInviteesRepository } from "./repositories/postgres/inviteesRepository";
import { UserService } from "./services/userService";
import { EventService } from "./services/eventService";
import { InviteeService } from "./services/inviteesService";
import { UserController } from "./controllers/userController";
import { AuthController } from "./controllers/authController";
import { EventController } from "./controllers/eventController";
import { InviteeController } from "./controllers/inviteesController";

dotenv.config();

const app = express();
const port = 3000;

// Connect to PostgreSQL database
const pgPool = connectPostgresDb();

// Repositories
const userRepository = new PostgresUserRepository(pgPool);
const eventRepository = new PostgresEventRepository(pgPool);
const inviteesRepository = new PostgresInviteesRepository(pgPool);

// Services
const userService = new UserService(userRepository);
const eventService = new EventService(eventRepository);
const inviteeService = new InviteeService(inviteesRepository);

// Controllers
const userController = new UserController(userService);
const authController = new AuthController(userService);
const eventController = new EventController(eventService);
const inviteeController = new InviteeController(inviteeService);

// Middlewares
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/api/users", userRoutes(userController));
app.use("/api/auth", authRoutes(authController));
app.use("/api/v1", eventRoutes(eventController));
app.use("/api/v1", inviteeRoutes(inviteeController));

// Handle Errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
