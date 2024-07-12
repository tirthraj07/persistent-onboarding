"use client"
import { useEffect, useState } from "react";


import Navbar from "@/components/Navbar/navbar";
import PasswordPage from "./Pages/password_page";
import ProfilePicturePage from "./Pages/profile_picture_page";

export default function UpdateProfilePage(){
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [PageComponent, setPageComponent] = useState<JSX.Element>(PasswordPage({handlePassword}));
    const [pass, setPassword] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<File>();

    useEffect(()=>{
        if(pageNumber < 1 || pageNumber > 2){
            setPageNumber(1);
        }

        if(pageNumber === 1){
            setPageComponent(PasswordPage({handlePassword}));
        }
        else if(pageNumber === 2){
            setPageComponent(ProfilePicturePage({uploadImageFunction, backPageButton}));
        }

    },[pageNumber])

    function handlePassword(password: string) : void {
        // TODO: Validate the password and display errors
        console.log(password)
        setPassword(password);
        setPageNumber(pageNumber + 1);
    }

    function uploadImageFunction(e: React.FormEvent<HTMLFormElement>) : void {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            file: HTMLInputElement
        }
        if (target.file.files) {
            const file = target.file.files[0];
            console.log(file);
            setProfilePicture(file);
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
            {PageComponent}
        </div>


        </>
    );
}