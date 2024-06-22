import { NextRequest, NextResponse } from "next/server";

import { query } from "@/lib/Database/databaseConnect";
import { JsonWebToken, Payload } from "@/lib/JWT/JWT";
import { generateHash } from "@/lib/Cryptography/createHash";

/**
 * Type definition for Employee object.
 */
type Employee = {
    employee_id: number,
    full_name: string,
    email: string,
    password: string
}

/**
 * Handles the POST request to create a new employee.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: NextRequest): Promise<NextResponse>{    
    const data = await request.json()

    // Verify the request body for necessary fields and correct types.
    const verifiedRequestBody = verifyRequestBody(data);
    if(verifiedRequestBody.error) return NextResponse.json({error: verifiedRequestBody.error},{status:verifiedRequestBody.status})

    // Validate the email format.
    if(!isValidPersistentEmail(data.email)){
        return NextResponse.json({ status:"fail", error:"Invalid email" }, {status:401});
    }

    // Employee object with hashed password.
    const employee : Employee = {
        employee_id : data.employee_id, 
        full_name : data.full_name,
        email : data.email,
        password: generateHash(data.password)
    };
    try{
        // Check if the employee ID or email already exists in the database.
        const isUniqueEmployee = await checkUniqueness(employee);

        if(!isUniqueEmployee){
            return NextResponse.json({ status:"fail", error:"Credentials conflict. EmployeeID or Email already exists" }, {status:401});
        }

        // Insert the new employee into the database.
        await createEmployeeInDatabase(employee);

        // Generate JWT token for the new employee.
        const jwtPayload : Payload = {
            employee_id: employee.employee_id,
            email: employee.email,
            full_name: employee.full_name
        };

        const jwtToken = new JsonWebToken().createToken(jwtPayload);

        const response = NextResponse.json({ status:"success" },{ status:201 });

        response.headers.set('Authorization',`Bearer ${jwtToken}`);

        return response;
    }
    catch(error){
        // Handle unique constraint violation for concurrency issues
        if (isDatabaseError(error) && error.code === '23505') {  
            return NextResponse.json({ status: "fail", error: "EmployeeId or Email already exists" }, { status: 401 });
        }
        console.error("Error processing request:", error);
        return NextResponse.json({ status: "error", error: "Internal Server Error" }, { status: 500 });
    
    }
}


// helper functions

/**
 * Verifies the request body for required fields and correct types.
 * 
 * @param {any} body - The request body.
 * @returns - An object with error and status properties.
 */
function verifyRequestBody(body: any) {
    const { employee_id, full_name, email, password } = body;

    if( !employee_id || !full_name || !email || !password ) return {error: "Incomplete credentials",status: 400}

    if (typeof(employee_id) !== 'number') return {error: "Invalid type: employee_id",status: 400}

    if (typeof(full_name) !== 'string') return {error: "Invalid type: full_name",status: 400}

    if (typeof(email) !== 'string') return {error: "Invalid type: email",status: 400}

    if (typeof(password) !== 'string') return {error: "Invalid type: password",status: 400}

    return { error: null }
}

/**
 * Validates if the provided email belongs to the persistent.com domain.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function isValidPersistentEmail(email: string) : boolean {
    const persistentEmailRegex = /^[a-zA-Z0-9._%+-]+@persistent\.com$/;
    return persistentEmailRegex.test(email);
}

/**
 * Checks if the employee ID or email already exists in the database.
 * 
 * @param {Employee} employee - The employee object.
 * @returns {Promise<boolean>} - True if the employee is unique, otherwise false.
 */
async function checkUniqueness(employee: Employee): Promise<boolean>{
    try{
        const searchedEmployeeIDResult = await query('SELECT COUNT(*) FROM employees WHERE employee_id = $1',[employee.employee_id])
        const searchedEmailIDResult = await query('SELECT COUNT(*) FROM employees WHERE email = $1', [employee.email])

        const employeeIDCount = parseInt(searchedEmployeeIDResult.rows[0].count, 10);
        const emailIDCount = parseInt(searchedEmailIDResult.rows[0].count, 10);

        if(employeeIDCount > 0 || emailIDCount > 0){
            return false;
        }

        return true;
    }
    catch(error){
        console.error("Error checking uniqueness:", error);
        throw error;
    }
}

/**
 * Inserts a new employee into the database.
 * 
 * @param {Employee} employee - The employee object.
 * @returns {Promise<void>}
 */
async function createEmployeeInDatabase(employee: Employee): Promise<void>{
    try {
        await query(
            "INSERT INTO employees (employee_id, full_name, email, password) VALUES ($1, $2, $3, $4)", 
            [employee.employee_id, employee.full_name, employee.email, employee.password]
        );
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

/**
 * Type guard to check if the error is a database error.
 * 
 * @param {any} error - The error object.
 * @returns {boolean} - True if the error is a database error, otherwise false.
 */
function isDatabaseError(error: any): error is { code: string } {
    return error && typeof error === 'object' && 'code' in error;
}