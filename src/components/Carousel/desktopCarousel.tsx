import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

export default function DesktopCarousel(){
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true, stopOnLastSnap:false })
    )

    const videos = [
        { url: "https://www.youtube.com/embed/wMYHZQ6DWj4?si=9MqXIq_bBx-_-GFO" },
        { url: "https://www.youtube.com/embed/70GorVKnYIw?si=NAvVxxmquyWto_jd" },
        { url: "https://www.youtube.com/embed/1dyn-Pj2DT0?si=ot87rYUUwhnWirZx" }
    ];

    return(
        <>

            <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-2xl"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="rounded-2xl">
                    {videos.map((video, index) => (
                        <CarouselItem key={index}>
                          <div className="w-full h-full rounded-2xl">
                            <Card>
                              <CardContent className="relative pb-[56.25%] h-0">
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                                  src={video.url}
                                  title={`YouTube video player ${index}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                ></iframe>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    )
}
