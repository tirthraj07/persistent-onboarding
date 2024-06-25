import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "jose";
import { parse, formatISO } from 'date-fns';

import { query } from "@/lib/Database/databaseConnect";

export async function handlePATCHRequest(request: NextRequest, token: JWTPayload): Promise<NextResponse>{
    const body = await request.json();
    if (!token.employee_id) {
        console.error(`ERROR: Token ${JSON.stringify(token)} did not contain an employee_id but bypassed the security checks`);
        return NextResponse.json({ error: "User cannot be found in database" }, { status: 500 });
    }
    try{
        const permittedFields = [
            "full_name",
            "email",
            "gender",
            "date_of_birth",
            "address",
            "blood_group",
            "education_qualification"
        ];

        

        const fieldsToUpdate = Object.keys(body).filter(key=> permittedFields.includes(key));

        if(fieldsToUpdate.length === 0){
            return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
        }

        if (body.date_of_birth) {
            body.date_of_birth = new Date(body.date_of_birth).toISOString();
            console.log(body.date_of_birth)
        }

        const setClause = fieldsToUpdate.map((field, index)=> `${field} = $${index+2}`).join(', ')

        const values = fieldsToUpdate.map(field => body[field]);

        const updateQuery = `
            UPDATE employees
            SET ${setClause}
            WHERE employee_id = $1
        `;

        await query(updateQuery, [token.employee_id, ...values]);

        return NextResponse.json({message: "Employee updated successfully"},{status:200});    
    }
    catch(error){
        console.error("ERROR: Error occurred while updating database.");
        console.error(`Payload supplied: ${JSON.stringify(body)}`);
        console.error(error);
        return NextResponse.json({error: "Internal Server Error"},{status:500})
    }
}