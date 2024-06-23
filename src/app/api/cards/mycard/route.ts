import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { JWTPayload } from "jose";


import { handleGetRequest } from "./handleRequest/handleGETRequest";
import { handlePATCHRequest } from "./handleRequest/handlePATCHRequest"




export async function GET(request: NextRequest) : Promise<NextResponse> {
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let decodedToken : JWTPayload;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
    const response: NextResponse = await handleGetRequest(request, decodedToken);
    return response;
}


export async function PATCH(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let decodedToken : JWTPayload;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
    const response: NextResponse = await handlePATCHRequest(request, decodedToken);
    response.headers.delete('x-decoded-token');
    return response;
}
