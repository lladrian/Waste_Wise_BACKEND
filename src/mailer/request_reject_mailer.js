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
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Account Request Update</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Regarding your WasteWise account application</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <!-- Main Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #333; margin: 0 0 15px; font-size: 24px;">Account Request Not Approved</h2>
                        <p style="color: #666; line-height: 1.6; margin: 0;">
                            We regret to inform you that your WasteWise account request has not been approved at this time.
                        </p>
                    </div>

                    <!-- Rejection Badge -->
                    <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 12px; padding: 15px; text-align: center; margin: 20px 0;">
                        <div style="display: inline-flex; align-items: center; background: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                            ❌ Account Status: Not Approved
                        </div>
                    </div>
                    
                    <!-- Application Information -->
                    <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #3b82f6;">
                        <h3 style="color: #1e40af; margin: 0 0 20px; font-size: 18px; display: flex; align-items: center;">
                            <span style="background: #3b82f6; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; margin-right: 10px;">📄</span>
                            Application Details
                        </h3>
                        
                        <div style="display: grid; gap: 15px;">
                            <div style="border-bottom: 1px solid #e0f2fe; padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Applicant Name:</div>
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
                            <div style="padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Contact Number:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.contact_number || 'Not provided'}</div>
                            </div>
                            <div style="border-bottom: 1px solid #e0f2fe; padding-bottom: 8px;">
                                <div style="color: #475569; font-weight: 500; margin-bottom: 4px;">Requested Role:</div>
                                <div style="color: #1e40af; font-weight: 600;">${data.role}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Next Steps -->
                    <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h4 style="color: #1e40af; margin: 0 0 15px; font-size: 16px; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">ℹ️</span>
                            What You Can Do Next
                        </h4>
                        <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Ensure all provided information was accurate and complete</li>
                            <li>Contact our support team if you believe this was an error</li>
                        </ul>
                    </div>

                   <!-- Contact Information -->
                    <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h4 style="color: #0369a1; margin: 0 0 15px; font-size: 16px; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">📞</span>
                            Need More Information?
                        </h4>
                        <p style="color: #475569; margin: 0 0 15px; line-height: 1.6;">
                            If you have questions about this decision or would like to discuss your application further, 
                            please contact our support team. We're here to help.
                        </p>
                        
                        <div style="display: grid; gap: 12px; margin-bottom: 15px;">
                            <!-- Email -->
                            <div style="display: flex; align-items: flex-start;">
                                <span style="color: #3b82f6; font-size: 16px; margin-right: 10px; margin-top: 2px;">📧</span>
                                <div>
                                    <div style="color: #374151; font-weight: 500; margin-bottom: 2px;">Email Address</div>
                                    <a href="mailto:support@wastewise.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                                        kapetstone@gmail.com
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Phone -->
                            <div style="display: flex; align-items: flex-start;">
                                <span style="color: #3b82f6; font-size: 16px; margin-right: 10px; margin-top: 2px;">📱</span>
                                <div>
                                    <div style="color: #374151; font-weight: 500; margin-bottom: 2px;">Phone Number</div>
                                    <div style="color: #475569; font-weight: 500;">+639123456789</div>
                                </div>
                            </div>
                            
                            <!-- Office Hours -->
                            <div style="display: flex; align-items: flex-start;">
                                <span style="color: #3b82f6; font-size: 16px; margin-right: 10px; margin-top: 2px;">🕒</span>
                                <div>
                                    <div style="color: #374151; font-weight: 500; margin-bottom: 2px;">Support Hours</div>
                                    <div style="color: #475569;">Monday - Friday: 8:00 AM - 5:00 PM</div>
                                </div>
                            </div>
                            
                            <!-- Website -->
                            <div style="display: flex; align-items: flex-start;">
                                <span style="color: #3b82f6; font-size: 16px; margin-right: 10px; margin-top: 2px;">🌐</span>
                                <div>
                                    <div style="color: #374151; font-weight: 500; margin-bottom: 2px;">Website</div>
                                    <a href="https://waste-wise-frontend-two.vercel.app" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                                        waste-wise-frontend-two.vercel.app
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 10px;">
                            <a href="mailto:support@wastewise.com" style="background: #3b82f6; color: white; padding: 10px 24px; text-decoration: none; border-radius: 20px; font-weight: 500; display: inline-block; font-size: 14px;">
                                📧 Contact Support
                            </a>
                        </div>
                    </div>

                    <!-- Thank You Message -->
                    <div style="text-align: center; margin: 30px 0 10px;">
                        <p style="color: #666; font-size: 14px; line-height: 1.5;">
                            Thank you for your interest in joining WasteWise. We appreciate your understanding.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #666; margin: 0 0 10px; font-size: 14px;">
                        For assistance, contact our support team at 
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