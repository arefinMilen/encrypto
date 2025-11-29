import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {UsernameValidation} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username: UsernameValidation
})
