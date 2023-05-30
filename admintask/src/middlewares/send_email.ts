import { config } from "dotenv";
config()
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const nodemailer_email= process.env.NODEMAILER_MAIL;
const nodemailer_password= process.env.NODEMAILER_PASSWORD;


const transport= nodemailer.createTransport(smtpTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth:{
        user: nodemailer_email,
        pass: nodemailer_password
    }
}))

const sendEmail = async (to: string, subject: string, body: any , text?:any) => {
    try {
        console.log("sending email")
        let mailOptions = {
            from: nodemailer_email,
            to: to,
            subject: subject,
            html: body,
            text: text,
        };

        transport.sendMail(mailOptions, (error: any , info: any )=>{
             if (error) {
               console.log("send email error", error);
             } else {
               console.log("Email sent: " + info.response);
             }
        })
    } catch (error) {
         console.log(error);
         throw error;  
    }
}

export default sendEmail;