"use server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cookies } from "next/headers";


import Navbar from "@/components/Navbar/navbar";

export default async function DashboardFunction(){
    const cookieStore = cookies()
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    const responseOfUserPermission = await fetch(`${process.env.PUBLIC_URL}/api/user-permission`, {
        method:"GET",
        headers:{
            "Content-Type": 'application/json',
            "Cookie": cookieHeader,
        },
    })
    const dataOfUserPermission = await responseOfUserPermission.json();
    
    return (
        <>
            <div className="relative min-h-20 overflow-hidden">
                <Navbar />
            </div>
            <div className="w-full flex flex-col relative p-5" style={{minHeight:"calc(100vh - 5rem)"}}>
                {JSON.stringify(dataOfUserPermission)}
                {/* <div className="w-full h-auto border-2 border-black flex flex-col md:flex-row">
                    <pre>
                    
                    </pre>
                </div> */}

            </div>

        </>
    )
}