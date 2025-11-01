import { Task } from "../entities/task.js"

export interface TaskService {
    create: (project: Task) => Promise<Task | null>
    update: (project: Task) => Promise<Task | null>
    delete: (projectId: string) => Promise<object | null>
}