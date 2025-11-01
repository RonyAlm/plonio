import { describe, test, expect, beforeAll } from "vitest";
import { createTask } from "./create-task.js";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { Task, TaskPriority, TaskStatus } from "../../entities/task.js";
import { MokedTaskService } from "../../services/mocks/mock-task-service.js";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";
import { UserRole } from "../../entities/user.js";


describe("CreateTask", async () => {

    const projectService = MokedProjectService();
    const taskService = MokedTaskService();
    const userService = MokedUserService();
    const dependencies = { projectService, taskService };

    beforeAll(() => {
        const user = {
            id: "id-user-not-member",
            name: "My User",
            email: "o9D5o@example.com",
            password: "12345678",
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        userService.save(user);

        const newProject = {
            id: "primer-proyecto-id",
            name: "Projecto de prueba",
            description: "Description 1",
            ownerId: "admin-2",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        projectService.save(newProject);
    });

    test("should create a task success", async () => {

        const userId = "admin-2";

        const newTask: Task = {
            title: "Task 1",
            description: "Description 1",
            projectId: "primer-proyecto-id",
            assigneeId: "admin-2",
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: { userId: userId, task: newTask }
            }
        );

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.task).toBeDefined();
        expect(result.isSuccess && result.task).toEqual(
            {
                ...newTask,
                id: result?.task?.id,
                status: TaskStatus.TODO,
                priority: TaskPriority.LOW,
                createdBy: userId,
                createdAt: result?.task?.createdAt,
                updatedAt: result?.task?.updatedAt

            });

    });

    test("should return error id userId is empty or not found", async () => {

        const newTask: Task = {
            title: "Task 1",
            description: "Description 1",
            projectId: "primer-proyecto-id",
            assigneeId: "admin-2"
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: {
                    userId: "", task: newTask
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials")
    });

    test("should return error if not existing project", async () => {

        const newTask: Task = {
            title: "Task 1",
            description: "Description 1",
            projectId: "id-proyecto-no-existente",
            assigneeId: "admin-2"
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: {
                    userId: "admin-2", task: newTask
                }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project not found");
    });

    test("should return error if a user assignee is not member of project", async () => {
        const newTask: Task = {
            title: "Task 1",
            description: "Description 1",
            projectId: "primer-proyecto-id",
            assigneeId: "id-user-not-member"
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", task: newTask }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Not member or owner of project");
    });

    test("should return error if task title is empty", async () => {

        const newTask: Task = {
            title: "",
            description: "Description 1",
            projectId: "primer-proyecto-id",
            assigneeId: "admin-2"
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", task: newTask }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid task title");
    });

    test("should return error if task status is empty or not exists", async () => {
        const newTask: Task = {
            title: "Task 1",
            description: "Description 1",
            status: "invalid" as TaskStatus,
            projectId: "primer-proyecto-id",
            assigneeId: "admin-2"
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", task: newTask }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Status not found");
    });

    test("should return error if task priority is empty or not exists", async () => {
        const newTask: Task = {
            title: "Task 1",
            description: "Description 1",
            priority: "invalid" as TaskPriority,
            projectId: "primer-proyecto-id",
            assigneeId: "admin-2"
        } as Task

        const result = await createTask(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", task: newTask }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Priority not found");
    });

});