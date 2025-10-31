import express from 'express'
import { Request, Response, NextFunction } from "express";
const usersRouter = express.Router()
import { assignRole, getUser, getUserProfile, loginUser, registerUser, revokeRole, updateUserProfile } from '../../../../domain/dist/index.js';
import { tokenExtractor, userExtractor } from '../utils/middleware.js';
import { UserServiceTypeorm } from '../services/user-service-typeorm.js';
import { PasswordServiceBcrypt } from '../services/password-service-bcrypt.js';
import { AuthServiceJwt } from '../services/auth-service-jwt.js';

const userService = new UserServiceTypeorm();
const passwordService = new PasswordServiceBcrypt();
const authService = new AuthServiceJwt();

usersRouter.get("/user/:id", async (req: Request, res: Response, next: NextFunction) => {

  const { id } = req.params

  try {
    const result = await getUser({ dependencies: { userService }, payload: { id: id as string } });
    if (result.isSuccess) res.status(201).json(result)
  } catch (error) {
    next(error);
  }

})

usersRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {

  const userInput = {
    id: req.body.id || crypto.randomUUID(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "USER",
    createdAt: req.body.createdAt || new Date(),
    updatedAt: req.body.updatedAt || new Date()
  }

  try {
    const result = await registerUser({ dependencies: { userService, passwordService }, payload: userInput });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }

});

usersRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {

  const dependencies = { userService, passwordService, authService }

  try {
    const result = await loginUser({ dependencies: dependencies, payload: req.body });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }

});

usersRouter.use(tokenExtractor)
usersRouter.use(userExtractor)

usersRouter.get("/me", async (req: Request, res: Response, next: NextFunction) => {

  const { userId } = await req.user

  try {
    const result = await getUserProfile({ dependencies: { userService }, payload: { userId: userId } });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }

});

usersRouter.put("/me", async (req: Request, res: Response, next: NextFunction) => {

  const { userId } = await req.user

  const userInput = {
    ...req.body,
    updatedAt: req.body.updatedAt || new Date()
  }

  const dependencies = { userService, passwordService }
  const payload = { userId: userId, input: userInput }

  try {
    const result = await updateUserProfile({ dependencies: dependencies, payload: payload });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }

});

usersRouter.put("/user/:id/role", async (req: Request, res: Response, next: NextFunction) => {

  const targetUserId = req.params.id
  const role = req.body.role

  const { userId } = await req.user

  const dependencies = { userService }
  const payload = { adminId: userId, targetUserId: targetUserId as string, role: role }

  try {
    const result = await assignRole({ dependencies: dependencies, payload: payload });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }

})

usersRouter.delete("/user/:id/role", async (req: Request, res: Response, next: NextFunction) => {

  const targetIdUser = req.params.id

  const { userId } = await req.user

  const dependencies = { userService }
  const payload = { adminId: userId, targetUserId: targetIdUser as string }

  try {
    const result = await revokeRole({ dependencies: dependencies, payload: payload });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }

})

export default usersRouter