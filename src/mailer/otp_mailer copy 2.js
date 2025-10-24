import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from 'dotenv';
dotenv.config();




const sendEmail = async (email, subject, otp) => {
  console.log(1)
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  console.log(2)
  const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  console.log(3)
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  console.log(4)
  const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
  console.log(5)
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  console.log(6)
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  console.log(7)
  const accessToken = oAuth2Client.getAccessToken();
  console.log(9)
  // console.log(accessToken)
   console.log(accessToken.token)
     console.log(10)
     return;
  // return null;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: `"WasteWise - " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="text-align: center; color: #4CAF50;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">
          Your OTP code is <strong style="color: #FF5722; font-size: 20px;">${otp}</strong>. 
          Use this code to complete your password reset process. This code will expire in 1 minute.
        </p>
        <p style="font-size: 16px; color: #333;">
          If you did not request a password reset, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 14px; color: #777; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;