import { describe, test, expect } from "vitest";
import { getProject } from "./get-project.js";
import { Project } from "../../entities/Project.js";

const projectData: Project[] = [
    {
        id: "1",
        name: "Project 1",
        description: "Description 1",
        ownerId: "1",
        members: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "Project 2",
        description: "Description 2",
        ownerId: "2",
        members: [],
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

describe("GetProject", async () => {
   
    const projectService = {
        getById: async (id: string) => {
            return projectData.find(project => project.id === id)
        },

        getAll: async () => {
            return projectData
        }
    }

    test("should get a project by id",  async () => {
        const result = await getProject({ dependencies: { projectService }, payload: {id: "2"}});

        expect(result).toStrictEqual({
            id: "2",
            name: "Project 2",
            description: "Description 2",
            ownerId: "2",
            members: [],
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        })
    });

    test("should get error if project not found",  async () => {
        const result = await getProject({ dependencies: { projectService }, payload: {id: "3"}});

        expect(result).toBeUndefined()
    });
});