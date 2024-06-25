"use client"
import DesktopCarousel from "@/components/Carousel/desktopCarousel";
import DesktopNavbar from "@/components/Navbar/desktopNavbar";
import MobileNavbar from "@/components/Navbar/mobileNavbar";
import { useMediaQuery } from "@/hooks/use-media-query"; 

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>

      <div className={`relative w-full overflow-hidden ${isDesktop? 'h-screen' : 'h-auto'}`}>
        {isDesktop? <DesktopNavbar/> : <MobileNavbar/>}
        <video 
          className={`w-full object-cover ${isDesktop ? 'absolute top-0 left-0 h-full' : '' }`}
          src="/videos/hero_section.mp4"
          autoPlay
          muted
          loop
        />

          {isDesktop? 
          <>
            <div className="bg-black bg-opacity-30 absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-5">
              <h1 className="text-white text-6xl font-extrabold ">
                Welcome to Persistent
              </h1>
              <h2 className="text-white text-xl">
                A trusted <strong> Digital Engineering </strong> and <strong> Enterprise Modernization </strong> partner.
              </h2>
            </div>
          </>:<></>}
      </div>


      <div className="flex flex-col gap-5 mt-5 justify-center items-center p-5">
        <h1 className="text-black text-4xl font-bold ">
          Who We Are.
        </h1>
        <DesktopCarousel />
      </div>
            
    </>
  );
}
