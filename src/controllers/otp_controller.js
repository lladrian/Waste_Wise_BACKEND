import asyncHandler from "express-async-handler";
import moment from "moment-timezone";
import dotenv from "dotenv";
import OTP from "../models/otp.js";
import User from "../models/user.js";

import crypto from 'crypto';
import mailer from '../mailer/otp_mailer.js'; // Import the mailer utility

import axios from "axios";

import credential_mailer_new_user_1 from '../mailer/credential_mailer_new_user.js'; // Import the mailer utility
import credential_mailer_1 from '../mailer/credential_mailer.js'; // Import the mailer utility

import request_approval_mailer_1 from '../mailer/request_approval_mailer.js'; // Import the mailer utility
import request_reject_mailer_1 from '../mailer/request_reject_mailer.js'; // Import the mailer utility

function base_url(req) {
    const protocol = req.protocol; // "http" or "https"
    const host = req.get("host");  // e.g., "waste-wise-backend-uzub.onrender.com"
    const baseUrl = `${protocol}://${host}`;
    return baseUrl;
}


function storeCurrentDate(expirationAmount, expirationUnit) {
    // Get the current date and time in Asia/Manila timezone
    const currentDateTime = moment.tz("Asia/Manila");
    // Calculate the expiration date and time
    const expirationDateTime = currentDateTime
        .clone()
        .add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format(
        "YYYY-MM-DD HH:mm:ss"
    );

    // Return both current and expiration date-time
    return formattedExpirationDateTime;
}

function generateSecureOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        otp += digits[bytes[i] % 10];
    }
    return otp;
}


export const verify_otp = asyncHandler(async (req, res) => {
    const { otp_type, email, otp } = req.body;

    try {
        // 1. Validate input
        if (!otp_type || !email || !otp) {
            return res.status(400).json({
                message: "Please provide all fields: otp_type, email, otp."
            });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 3. Define which field to check based on otp_type
        const otpFieldMap = {
            recovery: { field: "otp_recovery", createdField: "otp_recovery_created" },
            verification: { field: "otp_verification", createdField: "otp_verification_created" },
        };

        const selected = otpFieldMap[otp_type];
        if (!selected) {
            return res.status(400).json({ message: "Invalid otp_type." });
        }

        const otpRecord = await OTP.findOne({ user: user.id, [selected.field]: otp });
     
        if (!otpRecord) {
            return res.status(400).json({ message: "Incorrect OTP." });
        }

        // 5. Check if OTP has expired (1 minute)
        const createdTimeStr = otpRecord[selected.createdField]; // "2025-10-30 18:31:34"
        const createdTime = new Date(createdTimeStr.replace(" ", "T") + "+00:00");
        
        // Get current time in Manila timezone correctly
        const now = new Date();
        const manilaOffset = 8 * 60; // Manila is UTC+8 in minutes
        const localOffset = now.getTimezoneOffset(); // in minutes
        const nowManila = new Date(now.getTime() + (localOffset + manilaOffset) * 60000);
        
        // Calculate difference in minutes
        const diffMinutes = (nowManila.getTime() - createdTime.getTime()) / (1000 * 60);

        if (diffMinutes > 1) {
            return res.status(400).json({ message: "OTP has expired." });
        }

        // 6. OTP is valid
        return res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to verify OTP." });
    }
});


export const request_approval_mailer = asyncHandler(async (req, res) => {
    const { email, formatted_input_data } = req.body;

    try {
        await request_approval_mailer_1(email, formatted_input_data);

        return res.status(200).json({ data: "Message successfully sent." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message." });
    }
});

export const request_reject_mailer = asyncHandler(async (req, res) => {
    const { email, formatted_input_data } = req.body;

    try {
        await request_reject_mailer_1(email, formatted_input_data);

        return res.status(200).json({ data: "Message successfully sent." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message." });
    }
});


export const credential_mailer = asyncHandler(async (req, res) => {
    const { email, formatted_input_data } = req.body;

    try {
        await credential_mailer_1(email, formatted_input_data);

        return res.status(200).json({ data: "Message successfully sent." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message." });
    }
});

export const credential_mailer_new_user = asyncHandler(async (req, res) => {
    const { email, formatted_input_data } = req.body;

    try {
        await credential_mailer_new_user_1(email, formatted_input_data);

        return res.status(200).json({ data: "Message successfully sent." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message." });
    }
});


export const otp_mailer = asyncHandler(async (req, res) => {
    const { otp, email, subject } = req.body;

    try {
        await mailer(email, subject, otp);

        return res.status(200).json({ data: "OTP successfully created." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create OTP." });
    }
});

export const create_otp = asyncHandler(async (req, res) => {
    const { otp_type, email } = req.body;

    try {
        if (!otp_type || !email) {
            return res.status(400).json({ message: "Please provide all fields (otp_type, email)." });
        }
        const url = base_url(req); // pass req to the function
        const user = await User.findOne({ email })
        const subject = "OTP Code";

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const updatedOTP = await OTP.findOne({ user: user._id })
        const otp = generateSecureOTP();


        if (otp_type === 'recovery') {
            updatedOTP.otp_recovery = otp ? otp : updatedOTP.otp_recovery;
            updatedOTP.otp_recovery_created = storeCurrentDate(0, "hours");

            await updatedOTP.save();
        }

        if (otp_type === 'verification') {
            updatedOTP.otp_verification = otp ? otp : updatedOTP.otp_verification;
            updatedOTP.otp_verification_created = storeCurrentDate(0, "hours");

            await updatedOTP.save();
        }

        if (url.includes('localhost') || url.includes('waste-wise-backend-chi.vercel.app')) {
            await mailer(email, "OTP Code", otp);
        } else if (url.includes('waste-wise-backend-uzub.onrender.com')) {
            await axios.post(`http://waste-wise-backend-chi.vercel.app/otp/otp_mailer`, { otp, email, subject });
        }

        return res.status(200).json({ data: "OTP successfully created." });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create OTP." });
    }
});
