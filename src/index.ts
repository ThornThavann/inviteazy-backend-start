import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { UserService } from "./services/userService";
import { UserController } from "./controllers/userController";
import { AuthController } from "./controllers/authController";
import { InviteesController } from "./controllers/inviteesController";
import authRoutes from "./routes/authRoutes";
import { connectPostgresDb } from "./config/postgresdb/db";
// import { Firebase } from "./config/firebase/db";
import { PostgresUserRepository } from "./repositories/postgres/userRepository";
import { InviteeService } from "./services/inviteesService";
import { PostgresInviteesRepository } from "./repositories/postgres/inviteesRepository";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import inviteesRoutes from "./routes/inviteesRoutes";
// import inviteFireRoutes from "./routes/Invite-fire-route";

dotenv.config();

const app = express();
const port = 3000;

// Switch connection to database
// connectMongoDB();
const pgPool = connectPostgresDb();

// Repositories
// const userRepository = new MongoUserRepository();
const userRepository = new PostgresUserRepository(pgPool);
const inviteesRepository = new PostgresInviteesRepository(pgPool);

// Services
const userService = new UserService(userRepository);
const inviteeService = new InviteeService(inviteesRepository);

// Controllers
const userController = new UserController(userService);
const authController = new AuthController(userService);
const inviteesController = new InviteesController(inviteeService);

// Middlewares
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/api/users", userRoutes(userController));
app.use("/api/auth", authRoutes(authController));
app.use("/api/v1", inviteesRoutes(inviteesController));

// app.use("/api/invitees", inviteFireRoutes());

// Handle Errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});