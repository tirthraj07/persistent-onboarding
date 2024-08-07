'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


import React, { useState } from "react"


export default function UploadFileButton(
){
    const [certificate, setCertificate] = useState<File | null>();
    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [filename, setFileName] = useState<string>("");


    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.type.startsWith("image/") || file.type.startsWith("application/pdf")) {
                setCertificate(file);
                setButtonDisabled(false);
            } else {
                setCertificate(null);
                setButtonDisabled(true);
            }
        }
        else{
            setCertificate(null);
            setButtonDisabled(true);
        }
    }

    async function handleUploadForm(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(certificate && filename != ""){
            const formData = new FormData();
            formData.append('file', certificate);
            formData.append('filename', filename);
            console.log(formData)
            try{
                const response = await fetch('/api/cards/experience-certificate', {
                    method:'POST',
                    body: formData
                })  
                const data = await response.json();
                if(data['error']) throw new Error(data['error']);
                
                alert("Certificate Uploaded Successfully");
                window.location.reload();
            }
            catch(error){
                alert("Error occurred while uploading document");
                console.error(error);
            }
        }
    }


    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Upload</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Upload Experience Certificate</DialogTitle>
                    <DialogDescription>
                        Upload your document here. Click upload when you&apos;re done.
                    </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUploadForm}>
                        <div className="grid gap-4 py-4">
                                <Label htmlFor="filename">File Name</Label>
                                <Input id="filename" value={filename} type="text" autoComplete="off" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setFileName(e.target.value)}} placeholder="Enter File Name" />

                                <Label htmlFor="file">Upload File</Label>
                                <Input id="file" type="file" onChange={handleFileChange} accept="*" />
                        </div>
                        <DialogFooter>
                        <Button type="submit" disabled={isButtonDisabled}>Upload</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


        </>
    )
}