import express, { NextFunction } from 'express'
import { Request, Response } from "express";
const projectsRouter = express.Router()
import { createProject, deleteProject, getProject, listProjectsByUser, updateProject } from '../../../../domain/dist/index.js';
import { tokenExtractor, userExtractor } from '../utils/middleware.js';
import { ProjectServiceTypeorm } from '../services/project-service-typeorm.js';
import { UserServiceTypeorm } from '../services/user-service-typeorm.js';

const projectService = new ProjectServiceTypeorm();
const userService = new UserServiceTypeorm();
const dependencies = {
  projectService
}

projectsRouter.use(tokenExtractor)
projectsRouter.use(userExtractor)

projectsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {

  const { userId } = await req.user

  try {
    const result = await listProjectsByUser(
      {
        dependencies: {
          projectService: projectService,
          userService: userService
        },
        payload: {
          userId: userId as string
        }
      }
    )
    if (result.isSuccess) res.status(201).json(result);

  } catch (error) { next(error) }

})

projectsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {

  const { id } = req.params
  const { userId } = await req.user

  try {
    const result = await getProject(
      {
        dependencies: dependencies,
        payload: {
          projectId: id || '',
          userId: userId
        }
      });
    if (result.isSuccess) res.status(201).json(result);
  } catch (error) {
    next(error);
  }
})

projectsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {

  const { userId } = await req.user
  const { description, name, id } = req.body

  const projectInput = {
    id: id || crypto.randomUUID(),
    name: name,
    description: description
  }

  try {

    const result = await createProject(
      {
        dependencies: dependencies,
        payload: {
          userId: userId,
          project: projectInput
        }
      });

    if (result.isSuccess) {
      res.status(201).json(result);
    }
  } catch (error) {
    next(error);
  }

});

projectsRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { userId } = await req.user
  const { body } = req
  if (!id) return res.status(400).json({ isSuccess: false, error: 'project id is required' });

  try {
    const result = await updateProject(
      {
        dependencies: dependencies,
        payload: {
          userId: userId,
          projectId: id,
          project: body
        }
      });

    if (result.isSuccess) {
      res.status(201).json(result);
    }
  } catch (error) {
    next(error);
  }

})

projectsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { userId } = await req.user

  try {

    const result = await deleteProject(
      {
        dependencies: dependencies,
        payload: {
          userId: userId,
          projectId: id || ''
        }
      });

    if (result.isSuccess) {
      res.status(201).json(result);
    }

  } catch (error) {
    next(error);
  }
})

export default projectsRouter