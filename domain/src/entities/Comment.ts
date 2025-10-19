export interface Comment {
    id: string
    content: string
    authorId: string //(User.id)
    taskId: string //(Task.id)
    createdAt: Date
    updatedAt: Date
}