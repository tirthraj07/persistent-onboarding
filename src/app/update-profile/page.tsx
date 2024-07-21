"use client"
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import Navbar from "@/components/Navbar/navbar";
import PasswordPage from "./Pages/password_page";
import ProfilePicturePage from "./Pages/profile_picture_page";

export default function UpdateProfilePage(){
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<File | null>();
    const [displayError, setDisplayError] = useState<string>('hidden');
    const [error, setError] = useState<string>("");
    const [displaySuccess, setDisplaySuccess] = useState<string>('hidden');
    const router = useRouter();

    function handlePassword(password: string) : void {
        // TODO: Validate the password and display errors
        // console.log(password)
        setPassword(password);
        setPageNumber(pageNumber + 1);
    }

    async function uploadImageFunction(e: React.FormEvent<HTMLFormElement>)  {
        e.preventDefault();
        if(profilePicture && password){
            const formData = new FormData();
            formData.append('file', profilePicture);
            const payload = {
                password: password
            }
            formData.append('payload', JSON.stringify(payload));
            console.log(formData);
            try{
                const response = await fetch('/api/complete-profile', {
                    method:'POST',
                    body: formData
                })  
                const data = await response.json();
                if(data['error']) throw new Error(data['error']);
                setDisplayError('hidden');
                setDisplaySuccess('block');
                setTimeout(()=>{
                    router.push('/mycard');
                }, 2000)
            }
            catch(error){
                setDisplayError('block');
                setError("Unable to communicate with the server. Please try again later");
                setDisplaySuccess('hidden');
                console.error(error);
            }

        }
        
    }

    function backPageButton() : void {
        setPageNumber(pageNumber - 1);
    }

    return(
        <>
        <div className="relative min-h-20 overflow-hidden">
            <Navbar />
        </div>
        <div className="w-full flex flex-col justify-center items-center relative" style={{minHeight:"calc(100vh - 5rem)"}}>
            <Alert variant="destructive" className={`absolute top-0 left-0 z-0 ${displayError}`}>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>

            <Alert className={`absolute top-0 left-0 z-0 ${displaySuccess}`}>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                    You have successfully updated your profile. Redirecting..
                </AlertDescription>
            </Alert>


            {pageNumber === 1? <PasswordPage handlePassword={handlePassword} password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} /> : <></>}
            {pageNumber === 2? <ProfilePicturePage uploadImageFunction={uploadImageFunction} backPageButton={backPageButton} profilePicture={profilePicture} setProfilePicture={setProfilePicture}/>:<></>}
        </div>


        </>
    );
}