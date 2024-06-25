"use client"
import DesktopNavbar from "@/components/Navbar/desktopNavbar";
import MobileNavbar from "@/components/Navbar/mobileNavbar";
import { useMediaQuery } from "@/hooks/use-media-query"; 

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (<>
      {isDesktop? <DesktopNavbar/> : <MobileNavbar/>}
      </>
  );
}
