import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "jose";

import { query } from "@/lib/Database/databaseConnect";

export async function handleGetRequest(request: NextRequest, token: JWTPayload): Promise<NextResponse> {
    if (!token.employee_id) {
        console.error(`ERROR: Token ${JSON.stringify(token)} did not contain an employee_id but bypassed the security checks`);
        return NextResponse.json({ error: "User cannot be found in database" }, { status: 500 });
    }

    try {
        const informationFromEmployeesDB = await query(`SELECT * FROM employees WHERE employee_id = $1 LIMIT 1`, [token.employee_id]);

        if (informationFromEmployeesDB.rowCount === 0) {
            console.error(`ERROR: User with employee_id = ${token.employee_id} could not be found in the database but bypassed the prior security checks`);
            console.error(`This should not occur`);
            return NextResponse.json({ error: "User cannot be found in database" }, { status: 500 });
        }

        const employeeData = informationFromEmployeesDB.rows[0];
        console.log(employeeData);
        return NextResponse.json(employeeData);
    } catch (error) {
        console.error(`ERROR: Database query failed for employee_id = ${token.employee_id}`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}