import { describe, test, expect } from "vitest";
import { getProject } from "./get-project.js";
import { Project } from "../../entities/Project.js";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";

describe("GetProject", async () => {
   
    const projectService = MokedProjectService();

    test("should get a project by id",  async () => {
        const result = await getProject({ dependencies: { projectService }, payload: {id: "1"}});

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.project).toBeDefined();
        expect(result.isSuccess && result.project && result.project.id).toBe("1");
    });

    test("should get error if project not found",  async () => {
        const result = await getProject({ dependencies: { projectService }, payload: {id: "3"}});

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project not found");
    });

    test("should get error if id is empty",  async () => {
        const result = await getProject({ dependencies: { projectService }, payload: {id: ""}});

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project id is required");
    });
});