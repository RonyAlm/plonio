import { Member } from "./member.js"

export interface Project {
    id?: string
    name: string
    description?: string
    ownerId?: string
    members?: Member[]
    createdAt?: Date
    updatedAt?: Date
}


