import { NextRequest, NextResponse } from "next/server";
import { JsonWebToken } from "@/lib/JWT/JWT";

export async function POST(request: NextRequest){
    const token: string|undefined = request.cookies.get('token')?.value;

    if(!token){
        return NextResponse.json({status:"fail",error:"Unauthorized"}, {status:401});
    }

    const verifiedToken = await new JsonWebToken().validateToken(token);
    
    if(verifiedToken.success === false){
        const response = NextResponse.json({status:"fail",error:"Invalid authentication detected"}, {status: 401});
        response.cookies.delete('token');
        return response;
    }

    const response = NextResponse.json({status:"success",message:"Logout Successful"}, {status: 401});
    response.cookies.delete('token');
    return response;
}