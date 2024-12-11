import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from "bcrypt";
import * as z from "zod";

//Define schema for input validation
const UserSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })
  


export async function POST(req: Request) {
    try{
        const body = await req.json();
        const {email,username,password} = UserSchema.parse(body);
        //check if user already exist
        const existUserByEmail = await db.user.findUnique({
            where:{email:email}
        });
        if(existUserByEmail){
            return NextResponse.json({user:null,message:"user with this email already exist"},{status:409});
        }
        //check if username already exist
        const existUserByUsername = await db.user.findUnique({
            where:{username:username}
        });
        if(existUserByUsername){
            return NextResponse.json({user:null,message:"User with this username already exist"},{status:409});
        }

        const hashedPassword = await hash(password,10);
        const newUser = await db.user.create({
            data:{username,email,password:hashedPassword}
        });

        const {password:newUserPassword,...rest} = newUser;

        return NextResponse.json({user:rest,message:"user created successfully"},{status:201});
    }catch(error){
        return NextResponse.json(
            {  message: "An error occurred while creating the user" },
            { status: 500 }
        );
    }
    
}