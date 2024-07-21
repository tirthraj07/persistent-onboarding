import { cloudinary } from "./config";
import fs  from "fs"

export async function uploadToCloudinary( localFilePath: string|undefined, filename: string, foldername:string ){
    try{
        if(!localFilePath) throw new Error('Local File Path does not exist even though the function uploadToCloudinary was called.')
        const responseAfterUploadingToCloudinary = await 
        cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            filename_override: filename,
            folder: foldername, // any sub-folder name in your cloud
            use_filename: true,
        })

        console.log("Image uploaded to cloudinary successfully");
        
        fs.unlinkSync(localFilePath)

        return { success: true, url: responseAfterUploadingToCloudinary.url };

    }
    catch(error){
        console.error(`Error occurred while uploading to cloudinary. Passed arguments \n ${localFilePath} \n ${filename} \n ${foldername}`);
        console.error(error);
        if(localFilePath) fs.unlinkSync(localFilePath)
        return { success: false, error: "Unable to upload to cloud" };        
    }

}