import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { send } from "process";

export async function POST(request: Request){

    try {

        const {username,email,password} = await request.json()
        const  existingUserVerifiedByUsername = await 
        UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isverified){
                return Response.json({
                    success:false,
                    message: "Email is already exist with this email"
                }, {status: 400})
            } else {
               const hasedPassword = await bcrypt.hash(password,10)
               existingUserVerifiedByEmail.password = hasedPassword;
               existingUserVerifiedByEmail.verifyCode = verifyCode;
               existingUserVerifiedByEmail.veryfyCodeExpire = new Date(Date.now() + 3600000) // 1 hour from now 
               await existingUserVerifiedByEmail.save()

            }
        } else {
           const hasedPassword =  await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser =  new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                veryfyCodeExpire: expiryDate,
                isverified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()

        }
        //send verification email
      const emailResponse = await  sendVerificationEmail(email,username, verifyCode)
        
      if(!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message
        }, {status: 500})
      }
      return Response.json({
            success: true,
            message: "user registered successfully. please check your email for verification code"
        }, {status: 201})
    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json(
            {
                success: false,
                 message: "Internal Server Error"
                },
            {status: 500}
        )
    }
}