import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "User",
    tableName: "user",
    columns: {
        id: {
            type: String,
            primary: true,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
        },
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
        }
    }
})


