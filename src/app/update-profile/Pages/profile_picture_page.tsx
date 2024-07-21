"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import favicon from "../../../../public/favicon.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePicturePage(
{
    uploadImageFunction,
    backPageButton,
    profilePicture,
    setProfilePicture
}:
{
    uploadImageFunction: (e: React.FormEvent<HTMLFormElement>) => void,
    backPageButton: () => void,
    profilePicture : File | null | undefined,
    setProfilePicture: React.Dispatch<React.SetStateAction<File|null|undefined>>
}
){
    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.type.startsWith("image/")) {
                setProfilePicture(file);
                setImagePreview(URL.createObjectURL(file));
                setButtonDisabled(false);
            } else {
                setProfilePicture(null);
                setImagePreview(null);
                setButtonDisabled(true);
            }
        }
        else{
            setProfilePicture(null);
            setImagePreview(null);
            setButtonDisabled(true);
        }
    }
    useEffect(() => {
        // Cleanup the preview URL when the component is unmounted
        return () => {
            if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);


    

    return(
        <>
        <form onSubmit={uploadImageFunction}>
            <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="flex flex-col justify-center items-center gap-3 mb-2">
                <div>
                    <Image src={favicon.src} alt="favicon" width={30} height={30} />
                </div>
                <div>Upload Profile Picture</div>
                </CardTitle>
                <CardDescription className="text-center">
                    Please upload a professional profile picture
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input id="picture" type="file" onChange={handleFileChange} accept="image/jpeg, image/png"/>
                </div>

                {imagePreview && (
                    <div className="flex justify-center mt-4">
                    <Image
                        src={imagePreview}
                        alt="Image preview"
                        width={150}
                        height={150}
                        className="rounded"
                    />
                    </div>
                )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-5">
                <Button onClick={backPageButton}>
                Back
                </Button>
                <Button disabled={isButtonDisabled} type="submit">
                Submit
                </Button>
                
            </CardFooter>
            </Card>
        </form>
        </>
    );
}