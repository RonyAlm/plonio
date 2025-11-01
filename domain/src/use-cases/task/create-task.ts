import { Task, TaskPriority, TaskStatus } from "../../entities/task.js"
import { ProjectService } from "../../services/project-service.js"
import { TaskService } from "../../services/task-service.js"
import { isValidName } from "../../utils/validations.js"

interface CreateTaskParams {
    dependencies: {
        projectService: ProjectService
        taskService: TaskService
    }
    payload: {
        userId: string
        task: Task
    }
}

type CreateTaskResult = Promise<{ isSuccess: boolean, task?: Task, error?: string }>

export async function createTask({ dependencies, payload }: CreateTaskParams): CreateTaskResult {

    const { projectService, taskService } = dependencies;
    const { userId, task } = payload;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };

    const project = await projectService.findById(task.projectId);
    if (!project) return { isSuccess: false, error: "Project not found" };

    const isMember = project?.members && project.members.length > 0
        && project.members.find((member) => member.userId === task.assigneeId);

    const IsMemberOrOwner = isMember || project.ownerId === task.assigneeId;
    if (!IsMemberOrOwner) return { isSuccess: false, error: "Not member or owner of project" };

    if (!isValidName(task.title)) return { isSuccess: false, error: "Invalid task title" };

    if (!task.status) task.status = TaskStatus.TODO;
    if (!task.priority) task.priority = TaskPriority.LOW;

    const isValidStatus = Object.values(TaskStatus).includes(task.status as TaskStatus)
    if (!isValidStatus) return { isSuccess: false, error: "Status not found" };

    const isValidPriority = Object.values(TaskPriority).includes(task.priority as TaskPriority);
    if (!isValidPriority) return { isSuccess: false, error: "Priority not found" };

    const newTask: Task = {
        id: task.id || crypto.randomUUID(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
    } as Task;

    const taskCreated = await taskService.create(newTask);

    return { isSuccess: true, task: taskCreated as Task };
}