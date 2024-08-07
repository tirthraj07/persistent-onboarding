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

export default function IDCard({
    title,
    description,
    link
}:{ 
    title:string,
    description:string,
    link:string
}){

    return (
        <>
        <Card className="min-w-60 min-h-60 flex flex-col gap-10 justify-center items-center">
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild>
                    <Link href={link}>Select</Link>
                </Button>
            </CardFooter>
        </Card>
        </>
    )

}