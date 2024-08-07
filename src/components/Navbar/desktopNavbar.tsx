import Link from "next/link"
import favicon from "../../../public/favicon.png"
import Image from "next/image"
import { useEffect, useState } from "react";

export default function DesktopNavbar(){
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

        // console.log(isAuthenticated);
    },[])

    return(
        <>
            <header className="absolute z-10 top-0 left-0 flex h-20 w-full shrink-0 items-center px-4 md:px-6" style={{backgroundColor:"#322E34"}}>
                <nav className="flex-1 overflow-auto py-6">
                    <div className="grid gap-4 px-6 grid-rows-1 grid-flow-col">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white col-span-2"
                            prefetch={false}
                        >
                            <Image src={favicon.src} alt="favicon" width={30} height={30}/>
                            <span className="sr-only">Persistent Systems</span>
                            <span className="text-2xl font-semibold">Persistent Systems</span>
                        </Link>
                        <div className="col-span-1 grid grid-flow-col grid-cols-3 px-4">
                            <div className="flex justify-center align-middle">
                                <Link
                                    href="/"
                                    className="flex items-center rounded-lg px-3 py-2 text-white"
                                    prefetch={false}
                                >
                                    <span className="text-lg font-medium">Home</span>
                                </Link>
                            </div>
                            <div className="flex justify-center align-middle">
                                <Link
                                    href="/#about"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-white"
                                    prefetch={false}
                                >
                                    <span className="text-lg font-medium">About</span>
                                </Link>
                            </div>
                            <div className="flex justify-center align-middle">
                                <Link
                                    href={isAuthenticated? "/dashboard" : "/login"}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-white"
                                    prefetch={false}
                                >
                                    <span className="text-lg font-medium">{isAuthenticated? "Dashboard" : "Login"}</span>
                                </Link>
                            </div>
                            {isAuthenticated? 
                            <>
                                <div className="flex justify-center align-middle">
                                <Link
                                    href={"/logout"}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-white"
                                    prefetch={false}
                                >
                                    <span className="text-lg font-medium">Logout</span>
                                </Link>
                            </div>
                            </>:<></>}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}