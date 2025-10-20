import { loginUser, registerUser } from '../../../domain/dist/index.js';
import express, { Request, Response } from "express";
import createDb from './utils/createDB.js';
import { UserServiceImplementationTypeorm } from './services/user-service-implementation-typeorm.js';
import { PasswordServiceImplementation } from './services/password-service-implementation.js';
import { TokenServiceImplementation } from './services/token-service-implementation.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const db = await createDb();

const userService = new UserServiceImplementationTypeorm(db);
const passwordService = new PasswordServiceImplementation();
const tokenService = new TokenServiceImplementation();

app.post("/api/register", async (req: Request, res: Response) => {

  const result = await registerUser(
    {
      dependencies:
      {
        userService, passwordService
      },
      payload: req.body
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {

  const result = await loginUser(
    {
      dependencies:
      {
        userService, passwordService, tokenService
      },
      payload: req.body
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }

});

app.get("/api/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

export default app;
