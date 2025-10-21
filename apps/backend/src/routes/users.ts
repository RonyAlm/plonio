import express from 'express'
import { Request, Response } from "express";
const usersRouter = express.Router()
import { assignRole, getUser, getUserProfile, loginUser, registerUser, updateUserProfile } from '../../../../domain/dist/index.js';
import { UserServiceImplementationTypeorm } from '../services/user-service-implementation-typeorm.js';
import { PasswordServiceImplementation } from '../services/password-service-implementation.js';
import { TokenServiceImplementation } from '../services/token-service-implementation.js';
import createDb from '../utils/createDB.js';

const db = await createDb();

const userService = new UserServiceImplementationTypeorm(db);
const passwordService = new PasswordServiceImplementation();
const tokenService = new TokenServiceImplementation();

usersRouter.get('/', async (request, response) => {
   response.send('users')
})

usersRouter.post("/register", async (req: Request, res: Response) => {

  const userInput = {
    id: req.body.id || crypto.randomUUID(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "USER",
    createdAt: req.body.createdAt || new Date(),
    updatedAt: req.body.updatedAt || new Date()
  }

  const result = await registerUser(
    {
      dependencies:
      {
        userService, passwordService
      },
      payload: userInput
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
});

usersRouter.post("/login", async (req: Request, res: Response) => {

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

usersRouter.get("/me", async (req: Request, res: Response) => {

  let token;
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  if (!token) return res.status(400).json({ errror: 'token is invalid' })

  const result = await getUserProfile(
    {
      dependencies:
      {
        userService, tokenService
      },
      payload: {
        token: token
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }

});

usersRouter.put("/me/:id", async (req: Request, res: Response) => {

  const idUser = req.params.id
  const userInput = {
    ...req.body,
    createdAt: req.body.createdAt || new Date(),
    updatedAt: req.body.updatedAt || new Date()
  } 

  if (!idUser) return res.status(400).json({ error: 'User not found' });

  let token;
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  if (!token) return res.status(400).json({ error: 'token is invalid' });

  const result = await updateUserProfile(
    {
      dependencies:
      {
        userService, passwordService, tokenService
      },
      payload: {
        token: token,
        idUser: idUser,
        input: userInput
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }

});

usersRouter.get("/:id", async (req: Request, res: Response) => {

  const idUser = req.params.id

  if (!idUser) return res.status(400).json({ error: 'User not found' });

  const result = await getUser(
    {
      dependencies:
      {
        userService
      },
      payload: {
        idUser: idUser
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
})

usersRouter.put("/:id/role", async (req: Request, res: Response) => {

  const idUser = req.params.id
  const role = req.body.role

  if (!idUser) return res.status(400).json({ error: 'User not found' });

  let token;
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  if (!token) return res.status(400).json({ error: 'token is invalid' });

  const result = await assignRole(
    {
      dependencies:
      {
        userService, tokenService
      },
      payload: {
        token: token,
        idUser: idUser,
        role: role
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
})

export default usersRouter