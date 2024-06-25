import Link from "next/link"
import favicon from "../../../public/favicon.png"
import Image from "next/image"
import { useEffect, useState } from "react";


import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

export default function MobileNavbar(){
    const [isAuthenticated, setAuthenticatedState] = useState<boolean>(false);

    useEffect(()=>{
        const checkAuthentication = async () =>{
                const response = await fetch('/api/validate-token');
                const validatedToken = await response.json();
                if(validatedToken.success&&validatedToken.success === true){
                    setAuthenticatedState(true);
                }
                else{
                    setAuthenticatedState(false);
                }
            }

        checkAuthentication();

        console.log(isAuthenticated);
    },[])


    return(
        <>
           <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6" style={{backgroundColor:"#322E34"}}>
                <nav className="flex-1 overflow-auto py-6">
                    <div className="grid gap-4 px-1 grid-rows-1 grid-flow-col">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-lg py-2 text-white col-span-11"
                            prefetch={false}
                        >
                            <Image src={favicon.src} alt="favicon" width={30} height={30}/>
                            <span className="sr-only">Persistent Systems</span>
                            <span className="text-xl font-semibold">Persistent</span>
                        </Link>
                        <div className="col-span-1 grid grid-flow-col px-4">
                            <div className="flex justify-center align-middle">
                                <Drawer direction="right">
                                    <DrawerTrigger>
                                        <MenuIcon color="white" />
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter>
                                        <Button>Submit</Button>
                                        <DrawerClose className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"> 
                                            Close
                                        </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>                   
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        
       </>
    )
}