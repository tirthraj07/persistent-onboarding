import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "jose";

import { query } from "@/lib/Database/databaseConnect";
import { JsonWebToken } from "@/lib/JWT/JWT";


export async function handlePATCHRequest(request: NextRequest, token: JWTPayload): Promise<NextResponse>{
    return NextResponse.json({"message":"PATCH Request Working"});    
}