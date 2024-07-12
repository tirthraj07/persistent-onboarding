"use client"
import { useEffect, useState } from "react";

export default function ProfilePicturePage(
{
    uploadImageFunction,
    backPageButton
}:
{
    uploadImageFunction: (e: React.FormEvent<HTMLFormElement>) => void,
    backPageButton: () => void
}
){
    // const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // useEffect(()=>{
        // function handleSubmit() {
        //     if (selectedFile) {
        //         console.log(selectedFile)
        //     //     uploadImageFunction(selectedFile);
        //     } else {
        //         console.error("No file selected");
        //     }
        // }
    // }, [])

    
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            // setSelectedFile(event.target.files[0]);
        }
    }


    

    return(
        <>
            Profile Picture Page
            <form onSubmit={uploadImageFunction}>
                <input type="file" id="file" name="file" />
                <button type="submit">
                    Submit
                </button>
            </form>
            <button onClick={backPageButton}>
                BACK
            </button>
        </>
    );
}