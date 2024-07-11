import { NextRequest, NextResponse } from "next/server";


import { verifyPassword } from "@/lib/Cryptography/verifyPassword";
import { query } from "@/lib/Database/databaseConnect";
import { Payload, JsonWebToken } from "@/lib/JWT/JWT";



// POST Request

/**
 * Handles POST requests to the /api/login route.
 * Authenticates a user by verifying their email and password, and returns a JWT token if successful.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response object containing the status and any additional data.
 */
export async function POST(request: NextRequest): Promise<NextResponse>{
    const data = await request.json();
    const { email, password } = data;

    // Condition for email and password are not supplied
    if(!email || !password){
        return NextResponse.json({status:"fail",error:"Incomplete credentials"},{status:401});
    }

    // Check if the email domain is valid for persistent.com
    if(!isValidPersistentEmail(email)){
        return NextResponse.json({status:"fail", error:"Incorrect email or password"}, {status:401});
    }


    // Retrieve the hashed password from the database
    const searchedHashedPassword = await searchDatabaseForPassword(email);


    // Handle search failures
    if( searchedHashedPassword.status === "fail" ){
        
        // Email does not exist 
        if ( searchedHashedPassword.code === 404 ){

            return NextResponse.json({status:"fail", error:"Incorrect email or password"}, {status:404});
        
        }

        // Database Tampered
        if ( searchedHashedPassword.code === 500 ){
        
            return NextResponse.json({status:"fail", error:"Server side error"}, {status:500});
        
        }

        // Unknown error
        console.error("WARNING: Error not resolved correctly. Rejecting request with statusCode 500")
        console.error("Last Error Response: ", searchedHashedPassword.error);
        return NextResponse.json({status:"fail", error:"Unknown error"}, {status:500});
    }

    // Successful search,l
    // get the hashed password
    const hashedPassword = searchedHashedPassword.hashedPassword;

    if(!hashedPassword){
        return NextResponse.json({status:"fail", error:"Server side error"}, {status:500});
    }

    // Verify the submitted password against the hashed password
    if(!verifyPassword(password, hashedPassword)){
        return NextResponse.json({status:"fail", error:"Incorrect email or password"}, {status:401});
    }

    // Fetch additional information for the JWT payload
    const { employee_id, full_name } = await searchDatabaseForPayloadInformation(email);

    // Create JWT Token
    const jwtPayload : Payload = {
        email,
        employee_id,
        full_name
    }

    const jwtToken = await  new JsonWebToken().createToken(jwtPayload); 

    // Create the response and set the authorization header
    const response = NextResponse.json({status:"success"}, {status:200})

    response.cookies.set('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60 * 24 * 10, 
        path: '/',
    });
    
    return response;

}


// Helper functions


/**
 * Validates if the provided email belongs to the persistent.com domain.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function isValidPersistentEmail(email: string) : boolean {
    // const persistentEmailRegex = /^[a-zA-Z0-9._%+-]+@persistent\.com$/;
    const persistentEmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|persistent\.com)$/;
    return persistentEmailRegex.test(email);
}


/**
 * Searches the database for the hashed password of the provided email.
 * 
 * @param {string} email - The email address to search for.
 * @returns  An object containing the status, hashed password, and an optional error code.
 */
async function searchDatabaseForPassword(email: string) {
    const queryStatement = 'SELECT password FROM employees WHERE email = $1';
    const result = await query(queryStatement, [email]);
    
    const { rows, rowCount } = result;

    // Handle email not existing in the database
    if ( !rowCount || rowCount == 0 ){   
        return {status: "fail", error: "Email does not exist", code: 404};
    }

    // For Security: Should never happen as Database schema -> email UNIQUE
    // This could occur if database is tampered
    if ( rowCount > 1 ){
        console.error(`WARNING: Multiple instances of email ${email} exist in the Database.`)
        console.error("Rejecting Request");
        return {status: "fail", error: "Multiple instances of email in Database", code: 500};
    }
    
    // Return the hashed password
    return {status: "success", hashedPassword: <string>(rows[0].password), code:200};
    
}

/**
 * Searches the database for additional information to include in the JWT payload.
 * 
 * @param {string} email - The email address to search for.
 * @returns An object containing the employee ID and full name.
 */
async function searchDatabaseForPayloadInformation(email:string) {
    const queryStatement: string = 'SELECT employee_id, full_name FROM employees WHERE email = $1';
    const { rows } = await query(queryStatement, [email]);
    return {
        employee_id : rows[0].employee_id,
        full_name : rows[0].full_name
    };
}