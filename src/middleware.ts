import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { JsonWebToken } from "./lib/JWT/JWT";

/**
 * Middleware function to protect specific paths requiring authentication.
 * Redirects unauthenticated requests to the login page.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response object or moves to the next middleware.
 */
export async function middleware(request: NextRequest): Promise<NextResponse>{

    // API routes that need authentication
    const protected_api_routes = ['/api/cards/mycard']

    if(protected_api_routes.includes(request.nextUrl.pathname)){
        const headerList = headers();
        const authHeader = headerList.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            const response = NextResponse.json({error: "Unauthorized"},{status:401});
            return response;
        }

        const verifiedToken = await new JsonWebToken().validateToken(token);
        if(!verifiedToken.success || !verifiedToken.decodedToken){
            console.error(verifiedToken.error);
            console.error(verifiedToken.reason);
            const response = NextResponse.json({error: "Unauthorized"},{status:401});
            return response;
        }
        const decodedToken = verifiedToken.decodedToken;
        request.headers.set('x-decoded-token', JSON.stringify(decodedToken))
        const requestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        return response;
    }

    // Paths that require authentication
    const protected_paths = ['/mycard', '/edit-card']

    // Allow requests to pass through if path is not protected
    if (!protected_paths.includes(request.nextUrl.pathname)){
        return NextResponse.next();
    }

    // Retrieve headers from the request
    const headerList = headers();

    // Extract Authorization header and token
    const authHeader = headerList.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // Redirect to login page if no token is present
    if(!token){
        const redirect_url = new URL('/login', request.nextUrl);
        const response = NextResponse.redirect(redirect_url);
        return response;
    }

    // Validate the JWT token
    const jsonwebtoken = new JsonWebToken();
    const verifyToken = await jsonwebtoken.validateToken(token);

    // Redirect to login page if token validation fails
    if(!verifyToken.success){
        console.error(verifyToken.error);
        console.error(verifyToken.reason);
        const redirect_url = new URL('/login', request.nextUrl);
        const response = NextResponse.redirect(redirect_url);
        return response;
    }

    // Allow request to proceed
    return NextResponse.next();    
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',    // Regular expression to match all routes except specific static resources
    ],
};