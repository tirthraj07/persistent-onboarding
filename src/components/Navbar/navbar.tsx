'use client'

import { useMediaQuery } from "@/hooks/use-media-query";
import DesktopNavbar from "./desktopNavbar";
import MobileNavbar from "./mobileNavbar";

export default function Navbar(){
  const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <>
        {isDesktop? <DesktopNavbar/> : <MobileNavbar/>}
        </>
    )
}