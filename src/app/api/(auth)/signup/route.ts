import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/Database/databaseConnect";
import { JsonWebToken, Payload } from "@/lib/JWT/JWT";
import { generateHash } from "@/lib/Cryptography/createHash";
import generator from 'generate-password';
import { compileLoginWelcomeMessage, sendMail } from "@/lib/Nodemailer/sendMail";
import { group } from "console";
/**
 * Type definition for Employee object.
 */
type Employee = {
    employee_id: number | BigInt,
    full_name: string,
    email: string,
    password: string
    user_group: string
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

    let user_group:string = data.user_group || 'Default';
    const {group_name, group_id} = await getUserGroup(user_group);


    const temporaryPassword: string = generator.generate({
        length:10,
        numbers:true
    })

    // Employee object with hashed password.
    const employee : Employee = {
        employee_id : await generateEmployeeID(), 
        full_name : data.full_name,
        email : data.email,
        password: generateHash(temporaryPassword),
        user_group: group_name
    };
    try{
        // Check if the employee ID or email already exists in the database.
        const isUniqueEmployee = await checkUniqueness(employee);

        if(!isUniqueEmployee){
            return NextResponse.json({ status:"fail", error:"Credentials conflict. EmployeeID or Email already exists" }, {status:401});
        }

        // Insert the new employee into the database.
        await createEmployeeInDatabase(employee);

        await createRecordInUserGroupMembershipTable(employee.employee_id,group_id);

        await sendMail({
            to: employee.email,
            name: employee.full_name,
            subject: "Persistent Onboarding Email",
            body: compileLoginWelcomeMessage(employee.full_name, employee.email, temporaryPassword)
        });

        // Generate JWT token for the new employee.
        // const jwtPayload : Payload = {
        //     employee_id: employee.employee_id,
        //     email: employee.email,
        //     full_name: employee.full_name
        // };

        // const jwtToken = await  new JsonWebToken().createToken(jwtPayload);

        const response = NextResponse.json({ status:"success" },{ status:201 });

        // response.cookies.set('token', jwtToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production', 
        //     maxAge: 60 * 60 * 24 * 10, 
        //     path: '/',
        // });

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

async function getUserGroup(user_group: string): Promise<{group_name:string, group_id:number}>{
    const checkDatabaseForUserGroup = await query("SELECT * FROM user_groups WHERE group_name = $1", [user_group]);
    if(checkDatabaseForUserGroup.rows.length === 0) return getUserGroup('Default');
    else {
        const result = checkDatabaseForUserGroup.rows[0];
        return {group_id: <number>result.group_id, group_name: <string>result.group_name}
    }
}


async function createRecordInUserGroupMembershipTable(employee_id:number|BigInt, group_id:number){
    try {
        await query(
            `INSERT INTO user_group_memberships (employee_id, group_id) 
            VALUES ((SELECT id FROM employees WHERE employee_id = $1), $2)`, 
            [employee_id, group_id]
        );
    }
    catch (error) {
        console.error('Error inserting into user_group_memberships:', error);
        throw new Error('Database insertion failed');
    }
}


/**
 * Verifies the request body for required fields and correct types.
 * 
 * @param {any} body - The request body.
 * @returns - An object with error and status properties.
 */
function verifyRequestBody(body: any) {
    const { full_name, email } = body;

    if( !full_name || !email ) return {error: "Incomplete credentials",status: 400}

    if (typeof(full_name) !== 'string') return {error: "Invalid type: full_name",status: 400}

    if (typeof(email) !== 'string') return {error: "Invalid type: email",status: 400}

    return { error: null }
}

async function generateEmployeeID(): Promise<BigInt> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2,'0');
    const day = date.getDate().toString().padStart(2, '0');
    let uniqueID:number = generateRandomNumber(4);
    let employee_id:BigInt = BigInt(`${year}${month}${day}${uniqueID}`);
    while(await employeeIDExistsInDB(employee_id)){
        uniqueID = generateRandomNumber(4);
        employee_id = BigInt(`${year}${month}${day}${uniqueID}`);
    }
    return employee_id;
}

function generateRandomNumber(length:number) : number {
    return Math.floor(Math.pow(10,length-1) + Math.random() * ((Math.pow(10, length) - Math.pow(10, length - 1) - 1)));
}

async function employeeIDExistsInDB(employee_id: BigInt): Promise<boolean> {
    const searchedEmployeeIDResult = await query('SELECT COUNT(*) FROM employees WHERE employee_id = $1', [employee_id]);
    const employeeIDCount = parseInt(searchedEmployeeIDResult.rows[0].count, 10);
    return employeeIDCount > 0;
}


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