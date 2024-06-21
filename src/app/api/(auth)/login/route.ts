import { NextRequest, NextResponse } from "next/server";


import { verifyPassword } from "@/lib/Cryptography/verifyPassword";
import { query } from "@/lib/Database/databaseConnect";
import { Payload, JsonWebToken } from "@/lib/JWT/JWT";



// POST Request

export async function POST(request: NextRequest){
    const data = await request.json();
    const { email, password } = data;

    // if email and password are not supplied

    if(!email || !password){
        return NextResponse.json({status:"fail",error:"Incomplete credentials"},{status:401});
    }

    // if email does not belong to persistent.com

    if(!isValidPersistentEmail(email)){
        return NextResponse.json({status:"fail", error:"Incorrect email or password"}, {status:401});
    }


    // get the hashed password from the database. Rejects if email does not exist or database if tampered

    const searchedHashedPassword = await searchDatabaseForPassword(email);

    // search failed

    if( searchedHashedPassword.status === "fail" ){
        
        // Email does not exist 

        if ( searchedHashedPassword.code === 404 ){

            return NextResponse.json({status:"fail", error:"Incorrect email or password"}, {status:404});
        
        }

        // Database Tampered

        if ( searchedHashedPassword.code === 500 ){
        
            return NextResponse.json({status:"fail", error:"Server side error"}, {status:500});
        
        }

        console.error("WARNING: Error not resolved correctly. Rejecting request with statusCode 500")
        return NextResponse.json({status:"fail", error:"Unknown error"}, {status:500});
    }

    // search successful

    const hashedPassword = searchedHashedPassword.hashedPassword;

    // if submitted password does not match actual password

    if(!verifyPassword(password, hashedPassword)){
        
        return NextResponse.json({status:"fail", error:"Incorrect email or password"}, {status:401});
        
    }

    // fetch information from database for the JWT Token

    const { employee_id, full_name } = await searchDatabaseForPayloadInformation(email);

    // Create JWT Token

    const jwtPayload : Payload = {
        email,
        employee_id,
        full_name
    }

    const jwtToken = new JsonWebToken().createToken(jwtPayload); 

    // create response and set authorization header
    
    const response = NextResponse.json({status:"success"}, {status:200})

    const bearerToken = `Bearer ${jwtToken}`;
    
    response.headers.set('Authorization', bearerToken);

    return response;

}


// Helper functions

function isValidPersistentEmail(email: string) : boolean {
    const persistentEmailRegex = /^[a-zA-Z0-9._%+-]+@persistent\.com$/;
    return persistentEmailRegex.test(email);
}


async function searchDatabaseForPassword(email: string) {
    const queryStatement = 'SELECT password FROM employees WHERE email = $1';
    const result = await query(queryStatement, [email]);
    
    const { rows, rowCount } = result;

    // email does not exist in the database

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

    return {status: "success", hashedPassword: rows[0].password, code:200};
    
}

async function searchDatabaseForPayloadInformation(email:string) {
    const queryStatement: string = 'SELECT employee_id, full_name FROM employees WHERE email = $1';
    const { rows } = await query(queryStatement, [email]);
    return {
        employee_id : rows[0].employee_id,
        full_name : rows[0].full_name
    };
}