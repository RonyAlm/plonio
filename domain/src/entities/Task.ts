export const TaskStatus = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
} as const

export const TaskPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]
export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

export interface Task {
    id: string
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    projectId: string //(Project.id)
    assigneeId?: string //(User.id)
    createdBy?: string
    createdAt: Date
    updatedAt: Date
}