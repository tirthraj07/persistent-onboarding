import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function MobileCards(){
    const videos = [
        { url: "https://www.youtube.com/embed/wMYHZQ6DWj4?si=9MqXIq_bBx-_-GFO" },
        { url: "https://www.youtube.com/embed/70GorVKnYIw?si=NAvVxxmquyWto_jd" },
        { url: "https://www.youtube.com/embed/1dyn-Pj2DT0?si=ot87rYUUwhnWirZx" }
    ];
    
    return (
        <>  
            {videos.map((video, index)=>(
                <Card key={index} className="w-full p-0 shadow-lg">
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
            ))}
            
        
        </>
    )
}