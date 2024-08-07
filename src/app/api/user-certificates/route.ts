import { JWTPayload } from "jose";
import { query } from "@/lib/Database/databaseConnect";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let decodedToken : JWTPayload;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
        if(!decodedToken.employee_id) throw new Error('Employee_id not in decoded token')
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    try{
        const employee_id = Number(decodedToken.employee_id);
        const queryDatabaseForCertificates = await query("SELECT certificate_name AS name, location, public_id FROM experience_certification WHERE employee_id = $1", [employee_id]);
        const certificates = queryDatabaseForCertificates.rows;

        return NextResponse.json({"data":certificates},{status:200})
    }
    catch(error){
        console.error(`ERROR: couldn't complete the certificate fetching process. \n ${error}`);
        return NextResponse.json({error: "Couldn't fetch certificates"}, { status: 400 });
    }
}