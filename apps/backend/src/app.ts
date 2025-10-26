import express from "express";
import usersRouter from "./routes/users.route.js";
import { unknownEndpoint } from "./utils/middleware.js";


const app = express();

app.use(express.json());

app.use('/api', usersRouter)

app.use(unknownEndpoint);

export default app; 