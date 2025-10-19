import { Member } from "./Member.js"

export interface Project {
    id: string
    name: string
    description?: string
    ownerId: string //(User.id)
    members: Member[]
    createdAt: Date
    updatedAt: Date
}


