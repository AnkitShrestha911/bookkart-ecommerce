import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
});


transporter.verify((error, success) => {
  if(error) {
    console.log(error);
    console.log(typeof process.env.EMAIL_PASSWORD)
    console.log('gmail servies is not ready to send the mail, please check the email configuration');
  }else {
    console.log('gmail is ready to send the mail');
  }
})

const sendEmail = async (to:string, subject:string, body:string) => {
    await transporter.sendMail({
      from: `Your BookKart <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html:body
    })
}

export const sendVerificationEmail = async (to:string,token:string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`
  const html = `
    <h1>Welcome to your BookKart!</h1>
    <p>Thank you for registering. Please click this link below to verify you email address:</p>
    <a href="${verificationUrl}">Verify Email Here!</a>
    <p>If you didn't request this or already verified, please ignore this email</p>
  `

  await sendEmail(to,'Please Verify Your Email To Access Your BookKart',html);
}

export const sendResetPasswordLinkToEmail = async (to:string,token:string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
  const html = `
    <h1>Welcome to your BookKart! Reset Your passowrd</h1>
    <p>You have requested to reset your password, click the link below to set a new password: </p>
    <a href="${resetUrl}">Verify Email Here!</a>
    <p>If you didn't request this, please ignore this email</p>
  `

  await sendEmail(to,'Please Reset Your Password',html);
}