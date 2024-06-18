import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { JsonWebToken } from "./lib/JWT/JWT";

export async function middleware(request: NextRequest){
    const protected_paths = ['/mycard', '/edit-card']

    if (!protected_paths.includes(request.nextUrl.pathname) ){
        return NextResponse.next();
    }

    const headerList = headers();

    const authHeader = headerList.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        const redirect_url = new URL('/login', request.nextUrl);
        const response = NextResponse.redirect(redirect_url);
        return response;
    }

    const jsonwebtoken = new JsonWebToken();
    const verifyToken = jsonwebtoken.validateToken(token);

    if(!verifyToken.success){
        console.error(verifyToken.error);
        console.error(verifyToken.reason);
        const redirect_url = new URL('/login', request.nextUrl);
        const response = NextResponse.redirect(redirect_url);
        return response;
    }

    return NextResponse.next();    
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};