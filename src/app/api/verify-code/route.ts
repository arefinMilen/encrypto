import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();
    try{
       const {username, code} = await request.json()
       const decodedUsername =  decodeURIComponent(username)
       const user = await UserModel.findOne({username: decodedUsername})
         if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 500})
         }
         const isCodeValid = user.verifyCode === code
         const isCodeNotExpired = new Date(user.veryfyCodeExpire) >new Date()

         if (isCodeValid && isCodeNotExpired) {
            user.isverified = true
            await user.save()
            return Response.json({
                success: true,
                message: "user verified successfully"
            }, {status: 200})
         } else if (!isCodeValid){
            return Response.json({
                success: false,
                message: "Code is invalid please sign-up again to receive a new code"
            }, {status: 400})
         } else {
            return Response.json({
                success: false,
                message: "Incorrect Verification code"
            }, {status: 400})
         }

    } catch (error) {
        console.error("Error verifying code", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {status: 500})
    }
}