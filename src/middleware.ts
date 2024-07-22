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
    const protected_api_routes = ['/api/cards/mycard', '/api/logout', '/api/cards/profile_picture', '/api/complete-profile', '/api/user-permission']

    if(protected_api_routes.includes(request.nextUrl.pathname)){
        const token = request.cookies.get('token')?.value;

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
    const protected_paths = ['/mycard', '/edit-card', '/logout', '/update-profile']

    // Allow requests to pass through if path is not protected
    if (!protected_paths.includes(request.nextUrl.pathname)){
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

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
    if(!verifyToken.success || !verifyToken.decodedToken){
        console.error(verifyToken.error);
        console.error(verifyToken.reason);
        const redirect_url = new URL('/login', request.nextUrl);
        const response = NextResponse.redirect(redirect_url);
        return response;
    }

    if(request.nextUrl.pathname.includes('/logout')) return NextResponse.next();

    if(request.nextUrl.pathname.includes('/update-profile')){
        // Here check is the token has the is_completed flag set to True
        if(!verifyToken.decodedToken.is_completed){
            return NextResponse.next();
        }
        else {
            const redirect_url = new URL('/', request.nextUrl);
            const response = NextResponse.redirect(redirect_url);
            return response;
        }
    }

    if(!verifyToken.decodedToken.is_completed){
        const redirect_url = new URL('/update-profile', request.nextUrl);
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