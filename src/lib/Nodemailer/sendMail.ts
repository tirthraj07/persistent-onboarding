import nodemailer from "nodemailer"
import handlebars from "handlebars"
import { signupTemplate } from "@/components/Email/signup_template";

export async function sendMail({
    to,
    name,
    subject,
    body
}:{
    to: string,
    name: string,
    subject: string,
    body: string
}){

    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

    if(!SMTP_EMAIL || !SMTP_PASSWORD){
        console.error("ERROR: SMTP_EMAIL or SMTP_PASSWORD not set in the ENVIRONMENT variables");
        throw new Error("ENV (SMTP_EMAIL|SMTP_PASSWORD) NOT SET");
    }

    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        },
    });

    try{
        const testResults = await transport.verify();
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html:body
        }); 
    }
    catch(error){
        console.error("ERROR: " + error);
    }


}


export function compileLoginWelcomeMessage(name: string, email: string, password:string){
    const template = handlebars.compile(signupTemplate);
    const htmlBody = template({
        name:name,
        email:email,
        password:password
    })

    return htmlBody;

}