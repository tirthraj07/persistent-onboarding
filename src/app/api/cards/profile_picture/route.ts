import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: NextRequest){
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
        return NextResponse.json({ status:"error", message: "No files received." }, { status: 400 });
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json({ status:"error", message: "Only image/jpeg or image/png files are allowed." }, { status: 400 });
    }
    
    const fileArrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    try {
        await writeFile(
          path.join(process.cwd(), "public/uploads/" + filename),
          buffer
        );
        return NextResponse.json({ status: "success", message:"Profile Picture uploaded successful" }, {status: 201});
    } catch (error) {
        console.error("Error occurred ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}