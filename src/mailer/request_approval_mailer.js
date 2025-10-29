import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();



const sendEmail = async (email, data) => {
    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: "smtp.gmail.com",
        port: 465, // SSL port for Gmail
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"WasteWise Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Welcome to WasteWise!`,
        html: `
          <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
                body { font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f9fc; }
            </style>
        </head>
        <body>
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%); padding: 32px 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Account Approved! 🎉</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Welcome to WasteWise - Your account is now active</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <!-- Welcome Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #333; margin: 0 0 15px; font-size: 24px;">Your Account Has Been Approved!</h2>
                        <p style="color: #666; line-height: 1.6; margin: 0;">
                            Great news! Your WasteWise account request has been approved. You can now access the system using your registered credentials.
                        </p>
                    </div>

                    <!-- Approval Badge -->
                    <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 15px; text-align: center; margin: 20px 0;">
                        <div style="display: inline-flex; align-items: center; background: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                            ✅ Account Status: Approved & Active
                        </div>
                    </div>
                    
                    <!-- Account Information Card -->
                    <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #3b82f6;">
                        <h3 style="color: #1e40af; margin: 0 0 20px; font-size: 18px; display: flex; align-items: center;">
                            <span style="background: #3b82f6; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; margin-right: 10px;">👤</span>
                            Account Information
                        </h3>
                        
                        <div style="display: grid; gap: 15px;">
                            <div style="border-bottom: 1px solid #e0f2fe; padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Full Name:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.first_name} ${data.middle_name} ${data.last_name}</div>
                            </div>
                            <div style="border-bottom: 1px solid #e0f2fe; padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Email Address:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.email}</div>
                            </div>
                            <div style="border-bottom: 1px solid #e0f2fe; padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Gender:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase() : 'Not specified'}</div>
                            </div>
                            <div style="border-bottom: 1px solid #e0f2fe; padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Requested Role:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.role}</div>
                            </div>
                            <div style="padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Contact Number:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.contact_number || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Important Instructions -->
                    <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h4 style="color: #1e40af; margin: 0 0 15px; font-size: 16px; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">📋</span>
                            Getting Started
                        </h4>
                        <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Login to your account using your registered email and password</li>
                            <li>Explore the system features available for your role</li>
                            <li>Contact support if you need assistance</li>
                        </ul>
                    </div>

                    <!-- Security Note -->
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <div style="display: flex; align-items: flex-start;">
                            <span style="color: #dc2626; font-size: 18px; margin-right: 10px;">🔒</span>
                            <div>
                                <strong style="color: #dc2626;">Security Notice:</strong>
                                <p style="color: #666; margin: 5px 0 0; font-size: 14px; line-height: 1.5;">
                                    Keep your login credentials secure. Never share your password with anyone. 
                                    WasteWise staff will never ask for your password.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0 20px;">
                        <a href="https://waste-wise-frontend-two.vercel.app/login" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 25px; font-weight: 500; display: inline-block; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); font-size: 16px;">
                            🚀 Login to WasteWise
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #666; margin: 0 0 10px; font-size: 14px;">
                        Need help? Contact our support team at 
                        <a href="mailto:support@wastewise.com" style="color: #3b82f6; text-decoration: none;">support@wastewise.com</a>
                    </p>
                    <p style="color: #999; margin: 0; font-size: 12px;">
                        © 2024 WasteWise. Making the world cleaner, one step at a time.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;