import { NextRequest, NextResponse } from "next/server";
import { JsonWebToken } from "@/lib/JWT/JWT";

export async function GET(request: NextRequest){
    const token = request.cookies.get('token')?.value;
    if(!token){
        return NextResponse.json({success:false},{status:200})
    }

    const validatedToken = await new JsonWebToken().validateToken(token);

    return NextResponse.json({success:validatedToken.success}, {status:200})
    
}