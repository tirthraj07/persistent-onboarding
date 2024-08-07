import { uploadToCloudinary } from "@/lib/Cloudinary/uploadToCloudinary";
import { query } from "@/lib/Database/databaseConnect";
import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";


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

        const formData = await request.formData();

        if(formData.get('file')&&formData.get('filename')){
            const filename_db = formData.get('filename') as string;
            const responseAfterStoringImageLocally = await storeFileLocally(formData, employee_id);
            if(!responseAfterStoringImageLocally.success) throw new Error(`Unable to store file locally. ${responseAfterStoringImageLocally.error}`);
            else {
                const localFilePath = responseAfterStoringImageLocally.localFilePath
                const filename = responseAfterStoringImageLocally.filename;
                const responseAfterUploadingToCloud = await uploadToCloudinary(localFilePath, `${filename}`, "experience-certificates" )
                if(!responseAfterUploadingToCloud.success) throw new Error(`Unable to store image in cloud. ${responseAfterUploadingToCloud.error}`);
                else {
                    const url = responseAfterUploadingToCloud.url;
                    const public_id = responseAfterUploadingToCloud.public_id;
                    await query("INSERT INTO experience_certification (employee_id,certificate_name,location, public_id) VALUES ($1, $2, $3, $4)", [employee_id,filename_db,url, public_id]);
                }
            }


            return NextResponse.json({status:"success"});
        }
        else throw Error('Did not get file or filename from client');
        
    }
    catch(error){
        console.error(`ERROR: Database query failed for employee_id = ${decodedToken.employee_id}`)
        console.error(error);

        return NextResponse.json({status:"fail", error: error});
    }


}



async function storeFileLocally(formData: FormData, employee_id: string) {
    const file = formData.get('file') as File | null;
    if (!file) {
        return { success:false, error: "No files received." };
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedMimeTypes.includes(file.type)) {
        return { success:false, error: "Only image/jpeg, image/png, image/jpg or application/pdf files are allowed." };
    }

    let fileExtension = "jpg"
    if(file.type === 'image/jpeg') fileExtension = "jpg";
    else if(file.type === 'image/png') fileExtension = "png";
    else if (file.type === 'application/pdf') fileExtension = "pdf";
    
    const fileArrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);
    const filename = employee_id + "_ExperienceCertificate."+fileExtension;
    const localFilePath = path.join(process.cwd(), "public/uploads/" + filename);

    try {
        await writeFile(
          localFilePath,
          buffer
        );
        return { success: true, localFilePath:localFilePath, filename: filename };
    } catch (error) {
        console.error("Error occurred ", error);
        return { success: false, error: error }
    }
}