import UploadFileButton from "@/components/Dialog/uploadFileBox";
import Navbar from "@/components/Navbar/navbar";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default async function ExperiencePage(){
    const cookieStore = cookies()
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    const response = await fetch(`${process.env.PUBLIC_URL}/api/user-certificates`, {
        method:"GET",
        headers:{
            "Content-Type": 'application/json',
            "Cookie": cookieHeader,
        },
    })
    
    type Certificate = {
        name:string,
        location:string,
        public_id: string
    }
    
    const {data : certificates} = await response.json();


    return (
        <>
        <div className="relative min-h-20 overflow-hidden">
            <Navbar />
        </div>
        <div className="w-full flex flex-col relative p-5" style={{minHeight:"calc(100vh - 5rem)"}}>

            <div className="text-2xl text-center underline font-bold mb-3">
                Experience Certificates
            </div>

            <div className="w-full flex flex-row gap-6">
            {certificates?.map((certificate:Certificate) => {
                return(
                    <Card className="min-w-[250px]" key={certificate.public_id}>
                    <CardHeader>
                    <CardTitle style={{textTransform:"capitalize", textAlign:"center"}}>{certificate.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href={certificate.location} target="_blank">View</Link>
                    </Button>
                    </CardFooter>
                    </Card>
                )
            })}
            </div>

            <div className="fixed left-full top-full transform -translate-x-full -translate-y-full">
                <UploadFileButton />
            </div>
        </div>
        </>
    );
}