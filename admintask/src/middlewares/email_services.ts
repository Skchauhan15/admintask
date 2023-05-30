import path from "path";
import fs from "fs";
import sendEmail from "./send_email";

const sendWelcomeMail = async (data: any) => {
  try {
    let { email, email_otp, name } = data;
    let subject = "welcome to the app";
    let file_path = path.join(
      __dirname,
      "../email_templates/verification-mail.html"
    );
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%",name);
    html = html.replace("%OTP%", email_otp);
    await sendEmail(email, subject, html);
  } catch (err) {}
};
const resendOtpMail = async (data: any) => {
  try {
    let { email, email_otp, name } = data;
    let subject = "Resend OTP";
    let file_path = path.join(__dirname, "../email_templates/resend_otp.html");
    let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
    html = html.replace("%USER_NAME%", name);
    html = html.replace("%OTP%", email_otp);
    await sendEmail(email, subject, html);
  } catch (err) {
    throw err;
  }
};

const forgotPasswordMail = async (data: any) => {
  try {
     let { email, email_otp, name } = data;
     let subject = "Forgot Password";
     let file_path = path.join(__dirname, "../email_templates/reset_password.html");
     let html = await fs.readFileSync(file_path, { encoding: "utf-8" });
     html = html.replace("%USER_NAME%", name);
     html = html.replace("%OTP%", email_otp);
     await sendEmail(email, subject, html);
  } catch (err) {
    throw err;
  }
};


export {
    sendWelcomeMail,
    resendOtpMail, 
    forgotPasswordMail
}