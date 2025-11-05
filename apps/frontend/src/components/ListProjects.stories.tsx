import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from 'msw';
import ListProjects from "./ListProjects";
import { projectsMock } from "./__mocks__/projects";

const meta = {
    title: 'Components/ListProjects',
    component: ListProjects,
    parameters: {
        layout: 'padded',
    },

} satisfies Meta<typeof ListProjects>

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutProjects: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/api/projects', () => {
                    return HttpResponse.json([])
                }),
            ]
        }
    }
}

export const WithProjects: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/api/projects', () => {
                    return HttpResponse.json(projectsMock)
                }),
            ]
        }
    }
}