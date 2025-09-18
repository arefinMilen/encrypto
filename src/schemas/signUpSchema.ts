import {z} from 'zod'

export const uservalidationSchema = z
.string()
.min(3, "username must be at least 3 characters")
.max(20, "username must be at most 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores")
.trim()


export const signUpSchema = z.object({
    username: uservalidationSchema,
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})