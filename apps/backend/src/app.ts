import express from "express";
import userRouter from './routes/users.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/user', userRouter)

export default app; 