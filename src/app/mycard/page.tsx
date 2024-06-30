import Navbar from "@/components/Navbar/navbar";
import "./mycard.css"
import Card from "@/components/Card/card";
import { cookies } from "next/headers";

export default async function MyCardPage(){
    const cookieStore = cookies()
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    const response = await fetch(`${process.env.PUBLIC_URL}/api/cards/mycard`, {
        method:"GET",
        headers:{
            "Content-Type": 'application/json',
            "Cookie": cookieHeader,
        },
    })
    const data = await response.json();
    return(
        <>
            <div className="relative min-h-20 overflow-hidden">
                <Navbar />
            </div>
            <div className="w-full flex flex-col justify-center items-center relative" style={{minHeight:"calc(100vh - 5rem)"}}>
                <Card data={data}/>
            </div>

        </>
    )
}