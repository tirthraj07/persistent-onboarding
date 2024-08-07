"use server"


import { Badge } from "@/components/ui/badge"
import { cookies } from "next/headers";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

import Navbar from "@/components/Navbar/navbar";
import IDCard from "@/components/Permissions/IDCard/idcard";
import {PermissionRoutes, PermissionRoute, Route, Permission} from "@/app/configurations/permission_config"

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
                <div className="m-5 text-black text-sm">
                    <div className="inline-block mr-3">User Group:</div> 
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><Badge variant="secondary">{dataOfUserPermission.user_group.group_name}</Badge></TooltipTrigger>
                        <TooltipContent>
                            <p>{dataOfUserPermission.user_group.group_description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </div>
                <div className="w-full h-auto flex flex-col md:flex-row gap-8">
                    <IDCard title="Card" description="View ID Card" link="/mycard" />
                    <IDCard title="Experience" description="View and Upload Experience Certificates" link="/experience" />
                    {dataOfUserPermission.user_group.permissions.map((permission: Permission, index: number) => {
                        if(permission.url_address===null) return (<></>)
                        return (
                            <IDCard key={index} title={permission.url_name} description={permission.description} link={permission.url_address} />
                        )
                        
                    })}

                </div>

            </div>

        </>
    )
}