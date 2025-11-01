import { Task } from "../../entities/task.js";
import { TaskService } from "../task-service.js";

export function MokedTaskService(): TaskService {
  const tasks: Task[] = [];

  return {
    async create(project: Task): Promise<Task | null> {
      tasks.push(project);
      return project;
    },
    async update(project: Task): Promise<Task | null> {
      const index = tasks.findIndex((task) => task.id === project.id);
      if (index === -1) return null;
      tasks[index] = project;
      return project;
    },
    async delete(projectId: string): Promise<object | null> {
      const index = tasks.findIndex((task) => task.id === projectId);
      if (index === -1) return null;
      tasks.splice(index, 1);
      return {};
    }
  }
}
