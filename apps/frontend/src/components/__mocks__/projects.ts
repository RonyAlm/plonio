import { type Project } from "../ListProjects.ts";

export const projectsMock: Project[] = [
    {
        id: "id-project-1",
        name: "Desarrollo web",
        description: "Lorem ipsum dolor sit amet dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        ownerId: "id-user-2",
        members: [
            {
                id: "id-member-1",
                userId: "id-user-1",
                projectId: "id-project-1",
                role: "owner",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "id-project-2",
        name: "Desarrollo movil",
        description: "Lorem ipsum dolor sit amet dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        ownerId: "id-user-2",
        members: [
            {
                id: "id-member-1",
                userId: "id-user-1",
                projectId: "id-project-1",
                role: "owner",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "id-member-2",
                userId: "id-user-2",
                projectId: "id-project-1",
                role: "manager",
                createdAt: new Date(),
                updatedAt: new Date()
            }

        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];