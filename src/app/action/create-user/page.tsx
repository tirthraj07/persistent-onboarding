'use client'

import Navbar from "@/components/Navbar/navbar"
import * as React from "react"
import favicon from "../../../../public/favicon.png"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useState } from "react"


export default function CreateUserPage(){
    const [displayError, setDisplayError] = useState<string>('hidden');
    const [error, setError] = useState<string>("");
    const [displaySuccess, setDisplaySuccess] = useState<string>('hidden');
    const router = useRouter();
    const [isProcessing, setProcessing] = useState<boolean>(false);

    async function handleFormSubmission(e : React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setProcessing(true);
        const target = e.target as typeof e.target & {
            email: {value: string},
            full_name: {value: string}
        }

        const email = target.email.value;
        const full_name = target.full_name.value;
        const jsonPayload = {
            email: email,
            full_name: full_name
        }
        console.log(jsonPayload)

        try{
            const response = await fetch('/api/permissions/signup', {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(jsonPayload)
            })

            const data = await response.json();
            if(!data.status) throw new Error("Response status is undefined or null");
            else if(data.status === "fail"){
                setDisplayError('block');
                setError(data.error);
                setDisplaySuccess('hidden');
                setProcessing(false);
            }
            else if(data.status === "success"){
                setDisplayError('hidden');
                setDisplaySuccess('block');
                setTimeout(()=>{
                    router.push('/dashboard');
                }, 2000)
            }

        }
        catch(error){
            setDisplayError('block');
            setError("Unable to communicate with the server. Please try again later");
            setDisplaySuccess('hidden');
            console.error(error);
            setProcessing(false);
        }
        
    }

    return (
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
                    Account created successfully. Redirecting..
                </AlertDescription>
            </Alert>


            <form onSubmit={handleFormSubmission}>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="flex flex-col justify-center items-center gap-3 mb-2">
                        <div><Image src={favicon.src} alt="favicon" width={30} height={30}/></div>
                        <div>Create Account</div>
                    </CardTitle>
                    <CardDescription className="text-center">Create a new Persistent account</CardDescription>
                </CardHeader>
                <CardContent>
                    
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input id="full_name" name="full_name" type="text" autoComplete="off" required />
                        </div>
                        
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" autoComplete="off" required placeholder="example@persistent.com" />
                        </div>
                        
                    </div>
                    
                </CardContent>
                <CardFooter className="flex justify-center">
                    {/* <Button variant="outline">Cancel</Button> */}
                    <Button type="submit" disabled={isProcessing}>Create User</Button>
                </CardFooter>
                
            </Card>
            </form>

            </div>

            

        </>
    )
}
