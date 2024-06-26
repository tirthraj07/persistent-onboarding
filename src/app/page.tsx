"use client"
import DesktopCarousel from "@/components/Carousel/desktopCarousel";
import DesktopNavbar from "@/components/Navbar/desktopNavbar";
import MobileNavbar from "@/components/Navbar/mobileNavbar";
import { useMediaQuery } from "@/hooks/use-media-query"; 
import "@/app/globals.css"
import MobileCards from "@/components/Carousel/mobileCards";
import Navbar from "@/components/Navbar/navbar";

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>

      <div className={`relative w-full overflow-hidden ${isDesktop? 'h-screen' : 'h-auto'}`}>
        <Navbar />
        <video 
          className={`w-full object-cover ${isDesktop ? 'absolute top-0 left-0 h-full' : '' }`}
          src="/videos/hero_section.mp4"
          autoPlay
          muted
          loop
        />

          {isDesktop? 
          <>
            <div className="bg-black bg-opacity-30 hover:bg-opacity-60 transition-all absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-5">
              <h1 className="text-white text-6xl font-extrabold ">
                Welcome to Persistent
              </h1>
              <h2 className="text-white text-xl">
                A trusted <strong> Digital Engineering </strong> and <strong> Enterprise Modernization </strong> partner.
              </h2>
            </div>
          </>:<></>}
      </div>

      {isDesktop? 
        <>
        <div className="flex flex-col gap-5 mt-5 justify-center items-center p-5">
          <h1 className="text-black text-4xl font-bold ">
            Who We Are.
          </h1>
          <DesktopCarousel />
        </div>
        </>
        :
        <>
        <div className="w-full min-h-[100vh] relative p-5">
          <h1 className="text-black text-3xl font-semibold text-center tracking-wide leading-relaxed">
            Welcome to <br /> <strong className="underline underline-offset-4">Persistent Systems</strong>
          </h1>

          <h1 className="text-black text-4xl font-bold mt-20 text-center">
            Who We Are.
          </h1>

          <div className="m-auto mt-10 flex flex-col py-3 px-3 justify-evenly items-center gap-16">
            <MobileCards />
          </div>

        </div>

        </>
      
        }
        


    </>
  );
}
