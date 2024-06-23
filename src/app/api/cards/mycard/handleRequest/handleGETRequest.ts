import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "jose";

import { query } from "@/lib/Database/databaseConnect";
import { JsonWebToken } from "@/lib/JWT/JWT";

export async function handleGetRequest(request: NextRequest, token: JWTPayload): Promise<NextResponse>{
    const response = NextResponse.json({"message":"GET Request Working"});
    return response;
}