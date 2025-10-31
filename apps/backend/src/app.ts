import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routes/users.route.js";
import projectsRouter from "./routes/projects.route.js";
import { unknownEndpoint, errorHandler } from "./utils/middleware.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api', usersRouter)
app.use('/api/projects', projectsRouter)

app.use(errorHandler);
app.use(unknownEndpoint);

export default app; 