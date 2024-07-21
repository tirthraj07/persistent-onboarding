import { NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";


export async function storeProfilePictureLocally(formData: FormData, employee_id: string) {
    const file = formData.get('file') as File | null;
    if (!file) {
        return { success:false, error: "No files received." };
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.type)) {
        return { success:false, error: "Only image/jpeg, image/png or image/jpg files are allowed." };
    }

    let fileExtension = "jpg"
    if(file.type === 'image/jpeg') fileExtension = "jpg";
    else if(file.type === 'image/png') fileExtension = "png";
    
    const fileArrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);
    const filename = employee_id + "_ProfilePicture."+fileExtension;
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