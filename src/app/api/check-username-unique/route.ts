import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {uservalidationSchema} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username: uservalidationSchema
})

export async function GET(request : Request) {
    await dbConnect();
    try {

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )
    }
}