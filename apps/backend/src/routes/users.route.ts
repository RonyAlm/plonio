import express from 'express'
import { Request, Response } from "express";
const usersRouter = express.Router()
import { assignRole, getUser, getUserProfile, loginUser, registerUser, revokeRole, updateUserProfile } from '../../../../domain/dist/index.js';
import { tokenExtractor, userExtractor } from '../utils/middleware.js';
import { UserServiceTypeorm } from '../services/user-service-typeorm.js';
import { PasswordServiceBcrypt } from '../services/password-service-bcrypt.js';
import createDb from '../utils/createDb.js';
import { AuthServiceJwt } from '../services/auth-service-jwt.js';

const db = await createDb();

const userService = new UserServiceTypeorm(db);
const passwordService = new PasswordServiceBcrypt();
const authService = new AuthServiceJwt();


usersRouter.get("/users", async (req: Request, res: Response) => {

  const result = await getUser(
    {
      dependencies:
      {
        userService
      },
      payload: {
        id: ""
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
})

usersRouter.get("/user/:id", async (req: Request, res: Response) => {

  const { id } = req.params

  if (!id) return res.status(400).json({ isSuccess: false, error: 'user id is required' });

  const result = await getUser(
    {
      dependencies:
      {
        userService
      },
      payload: {
        id: id
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
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

  const dependencies = {
    userService, passwordService, authService
  }

  const result = await loginUser(
    {
      dependencies: dependencies,
      payload: req.body
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }

});

usersRouter.use(tokenExtractor)
usersRouter.use(userExtractor)

usersRouter.get("/me", async (req: Request, res: Response) => {

  const { userId } = await req.user

  const result = await getUserProfile(
    {
      dependencies:
      {
        userService
      },
      payload: {
        userId: userId
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }

});

usersRouter.put("/me", async (req: Request, res: Response) => {

  const decodedToken = await req.user
  if (!decodedToken) {
    return res.status(401).json({ isSuccess: false, error: 'token missing or invalid' })
  }

  const userInput = {
    ...req.body,
    updatedAt: req.body.updatedAt || new Date()
  }

  const result = await updateUserProfile(
    {
      dependencies:
      {
        userService, passwordService
      },
      payload: {
        userId: decodedToken.userId,
        input: userInput
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }

});

usersRouter.put("/user/:id/role", async (req: Request, res: Response) => {

  const targetUserId = req.params.id
  const role = req.body.role

  if (!targetUserId) return res.status(400).json({ isSuccess: false, error: 'target user id is required' });

  const decodedToken = await req.user
  if (!decodedToken) {
    return res.status(401).json({ isSuccess: false, error: 'token missing or invalid' })
  }

  const result = await assignRole(
    {
      dependencies:
      {
        userService
      },
      payload: {
        adminId: decodedToken.userId,
        targetUserId: targetUserId,
        role: role
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
})

usersRouter.delete("/user/:id/role", async (req: Request, res: Response) => {

  const targetIdUser = req.params.id

  if (!targetIdUser) return res.status(400).json({ isSuccess: false, error: 'target user id is required' });

  const decodedToken = await req.user
  if (!decodedToken) {
    return res.status(401).json({ isSuccess: false, error: 'token missing or invalid' })
  }

  const result = await revokeRole(
    {
      dependencies:
      {
        userService
      },
      payload: {
        adminId: decodedToken.userId,
        targetUserId: targetIdUser
      }
    });

  if (result.isSuccess) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result });
  }
})


export default usersRouter