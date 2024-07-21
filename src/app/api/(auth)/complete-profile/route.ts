import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "jose";
import { query } from "@/lib/Database/databaseConnect";
import { generateHash } from "@/lib/Cryptography/createHash";
import { storeProfilePictureLocally } from "./storeProfilePictureLocally";
import { uploadToCloudinary } from "@/lib/Cloudinary/uploadToCloudinary";
import { Payload, JsonWebToken } from "@/lib/JWT/JWT";


export async function POST(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let decodedToken : JWTPayload;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    if(!decodedToken.employee_id){ 
        console.error(`ERROR: Token ${JSON.stringify(decodedToken)} did not contain an employee_id but bypassed the security checks`);
        return NextResponse.json({ error: 'User cannot be found in database' })
    }



    try{

        const employee_id = String(decodedToken.employee_id);

        const informationFromEmployeesDB = await query(`SELECT * FROM employees WHERE employee_id = $1`, [decodedToken.employee_id]);
        if(informationFromEmployeesDB.rowCount !== 1){
            console.error(`ERROR: Zero or multiple instances of employee with employee_id = ${decodedToken.employee_id} exists`);
            console.error(`ROW COUNT FOR Query: SELECT * FROM employees WHERE employee_id = ${decodedToken.employee_id} : ${informationFromEmployeesDB.rowCount}`);
            return NextResponse.json({ error: "Internal Server Error" }, {status: 500});
        }

        const employee = informationFromEmployeesDB.rows[0];
        if(employee.is_completed === true){
            console.error(`ERROR: ${decodedToken.employee_id} got accessed to route ${request.nextUrl} even though employee.is_completed = ${employee.is_completed}`);
            return NextResponse.json({error : "Unauthorized"}, {status: 401});
        }

        const formData = await request.formData();

        if(formData.get('payload')&&formData.get('file')){
            const payload = formData.get('payload') as string
            const parsedPayload  = JSON.parse(payload);
            const password = parsedPayload['password'];
            if(!password){
                return NextResponse.json({error: "password not supplied"}, {status: 400});
            }
                        
            const updatePasswordInDBResult = await updatePassword(password, employee_id);
            if(updatePasswordInDBResult.success === false){
                return NextResponse.json({error: updatePasswordInDBResult.error});
            }
        
            const responseAfterStoringImageLocally = await storeProfilePictureLocally(formData, employee_id);
            if(!responseAfterStoringImageLocally.success) throw new Error(`Unable to store image locally. ${responseAfterStoringImageLocally.error}`);
            else {
                const localFilePath = responseAfterStoringImageLocally.localFilePath
                const filename = responseAfterStoringImageLocally.filename;
                const responseAfterUploadingToCloud = await uploadToCloudinary(localFilePath, `${filename}`, "profile-pictures" )
                if(!responseAfterUploadingToCloud.success) throw new Error(`Unable to store image in cloud. ${responseAfterUploadingToCloud.error}`);
                else {
                    const url = responseAfterUploadingToCloud.url;
                    await query("INSERT INTO profile_pictures (employee_id, location) VALUES ($1, $2)", [employee_id, url]);
                }
            }



            await query("UPDATE employees SET is_completed = $1 WHERE employee_id = $2", [true, employee_id]);

        
            const jwtPayload : Payload = {
                email : String(decodedToken.email),
                employee_id: Number(decodedToken.employee_id) ,
                full_name: String(decodedToken.full_name),
                is_completed : true
            }
            const jwtToken = await new JsonWebToken().createToken(jwtPayload); 

            const response =  NextResponse.json({status:"success"});
            response.cookies.delete('token');
            response.cookies.set('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 60 * 60 * 24 * 10, 
                path: '/',
            });
            return response;

        }
        else throw Error('Did not get payload from client');
        
    }
    catch(error){
        console.error(`ERROR: Database query failed for employee_id = ${decodedToken.employee_id}`)
        console.error(error);

        return NextResponse.json({status:"fail", error: error});
    }



}

async function updatePassword(password: string, employee_id: string) {
    if( validatePasswordRegex(password) === false ) {    
        return {success: false, error: "Weak Password"};
    }   

    try{
        const generatedHash = generateHash(password);
        await query("UPDATE employees SET password = $1 WHERE employee_id = $2", [generatedHash, employee_id]);   
        return {success: true}
    }
    catch(error){
        console.error(`ERROR: error occurred while updating password in database: \n ${error}`);
        return {success: false, error: 'Internal Server Error'};
    }
}


function validatePasswordRegex(password: string) {
    // Password validation logic
    if (password.length < 8) {
        return false; // Password must be at least 8 characters long
    }
    // Check for special symbols, numbers, and characters
    const containsSpecialChars = /[!@#$%^&*(),.?":{}|<>_]/;
    const containsNumbers = /\d/;
    const containsLetters = /[a-zA-Z]/;
    return containsSpecialChars.test(password) && containsNumbers.test(password) && containsLetters.test(password);
}