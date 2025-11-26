import {NextAuthOptions} from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect  from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) : Promise<any>{
                await dbConnect();
                try {
                  const user =  await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user) {
                        throw new Error("No user found with the given email or username.");
                    }
                    if (!user.isverified) {
                        throw new Error("Please verify your email before logging in.");
                    }
                    const isPasswordCorrect = await bcrypt.
                    compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect password.");
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
            
    ],

  callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isverified = token.isverified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
             }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isverified = user.isverified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
                }
            return token
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
    
}