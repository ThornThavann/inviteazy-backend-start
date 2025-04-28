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
import { PostgresInviteesRepository } from './repositories/postgres/inviteesRepository';
import inviteesRoutes from "./routes/inviteesRoutes";
import { connectPostgresDb } from "./config/postgresdb/db";
import { PostgresUserRepository } from "./repositories/postgres/userRepository";
import { loggingMiddleware } from "./middlewares/loggingMiddleware";
import eventRoutes from "./routes/eventRoute";
import { PostgresEventRepository } from "./repositories/postgres/eventRepositary";
import { EventService } from "./services/eventService";
import { EventController } from "./controllers/eventController";
import { connectFirebaseDb } from "./config/firebase/db";
import { FirebaseUserRepository } from "./repositories/firebasedb/userRepository";
import { FirebaseInviteesRepository } from "./repositories/firebasedb/inviteesRepository";
import { FirebaseEventRepository } from "./repositories/firebasedb/eventRepository";


// import eventFireRoutes from "./routes/firebaseRount";

// import inviteFireRoutes from "./routes/Invite-fire-route";
// import { Firebase } from "./config/firebase/db";

dotenv.config();

const app = express();
const port = 3000;

// Switch connection to database
// connectMongoDB();
// const pgPool = connectPostgresDb();
const pgPool =  connectFirebaseDb();


// Repositories
// const userRepository = new MongoUserRepository();

// firestore
const userRepository = new FirebaseUserRepository();
const inviteesRepository = new FirebaseInviteesRepository(pgPool);
const eventRepository = new FirebaseEventRepository(pgPool);

// Services
const inviteeService = new InviteeService(inviteesRepository);
const userService = new UserService(userRepository);
const eventService = new EventService(eventRepository);

// postgres
// const userRepository = new PostgresUserRepository(pgPool);
// const inviteesRepository = new PostgresInviteesRepository(pgPool);
// const eventRepository = new PostgresEventRepository(pgPool);

// Services
// const inviteeService = new InviteeService(inviteesRepository);
// const userService = new UserService(userRepository);
// const eventService = new EventService(eventRepository);

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
// app.use("/api/v1", eventRoutes(eventController));



// app.use("/api/events", eventFireRoutes());

// Handle Errors
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});