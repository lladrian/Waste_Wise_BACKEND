import nodemailer from "nodemailer";
import { google } from "googleapis";
dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID || '888837282883-2l9mujn6jvfs1l8lvpr68mu6uo3ij7u3.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || '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';
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN || '1//04qRwmB7Fk6pjCgYIARAAGAQSNwF-L9Ir0YFAsl5tP_elqnNo0UkrKhH4zYQJtSEIDbY_yvkZ9rbKnQtAetP0QUSvJn2CqkSssVY';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const sendEmail = async (email, subject, otp) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token,
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