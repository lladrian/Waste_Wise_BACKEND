import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Request from '../models/request.js';
import User from '../models/user.js';
import crypto from 'crypto';
import Notification from '../models/notification.js';

import request_approval_mailer from '../mailer/request_approval_mailer.js'; // Import the mailer utility
import request_reject_mailer from '../mailer/request_reject_mailer.js'; // Import the mailer utility
import axios from "axios";


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
    const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD HH:mm:ss');

    // Return both current and expiration date-time
    return formattedExpirationDateTime;
}


function hashConverterMD5(password) {
    return crypto.createHash('md5').update(String(password)).digest('hex');
}

function format_role(role) {
    const roleMap = {
        'admin': 'Admin',
        'resident': 'Resident',
        'enro_staff': 'ENRO Staff',
        'enro_staff_monitoring': 'ENRO Staff Monitoring',
        'enro_staff_scheduler': 'ENRO Staff Scheduler',
        'enro_staff_head': 'ENRO Staff Head',
        'enro_staff_eswm_section_head': 'ENRO Staff ESWM Section Head',
        'barangay_official': 'Barangay Official',
        'garbage_collector': 'Garbage Collector'
    };
    return roleMap[role] || role; // Return formatted role or original if not found
}


async function create_notification_many(user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link)." };
        }

        // Find all users with the specified role
        const users = await User.find({ role: user_role });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            category: category,
            link: link,
            created_at: storeCurrentDate(0, "hours")
        }));

        // Bulk insert all notifications at once
        const result = await Notification.insertMany(notifications);

        return { data: `Notification successfully sent to ${result.length} users.` };
    } catch (error) {
        console.error('Error creating notifications:', error);
        return error;
    }
}

export const create_request = asyncHandler(async (req, res) => {
    const { first_name, middle_name, last_name, gender, contact_number, password, email, role, barangay } = req.body;

    try {
        if (!first_name || !middle_name || !last_name || !gender || !contact_number || !password || !email || !role) {
            return res.status(400).json({ message: "Please provide all fields (first_name, middle_name, last_name, gender, contact_number, password, email, role)." });
        }

        if (await Request.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });

            // Handle role as array or single value
        let rolesArray = [];
        let currentRole = '';
        
        if (Array.isArray(role)) {
            // If role is already an array, use it directly
            rolesArray = role.map(r => ({ role: r }));
            currentRole = role[0]; // Set first role as current role
        } else {
            // If role is a single string, convert to array
            rolesArray = [{ role: role }];
            currentRole = role;
        }

        const newRequestData = {
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            gender: gender,
            contact_number: contact_number,
            password: hashConverterMD5(password),
            email: email,
            multiple_role: rolesArray, 
            role: currentRole, 
            barangay: role?.includes('barangay_official') ? barangay : null,
            created_at: storeCurrentDate(0, "hours")
        };

        const newRequest = new Request(newRequestData);
        await newRequest.save();
        await create_notification_many('admin', 'New user request for an account.', 'account_request', 'New Account Request', '/admin/approval/requests'); 

        return res.status(200).json({ data: 'New request successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create request.' });
    }
});

export const get_all_request = asyncHandler(async (req, res) => {
    try {
        const requests = await Request.find().populate('role');

        return res.status(200).json({ data: requests });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all requests.' });
    }
});

export const get_specific_request = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const request = await Request.findById(id);

        res.status(200).json({ data: request });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific request.' });
    }
});

export const update_request_approval = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { status, user } = req.body;

    try {
        if (!status || !user) {
            return res.status(400).json({ message: "Please provide all fields (status, user)." });
        }

        const updatedRequest = await Request.findById(id)


        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        const formatted_input_data = {
            first_name: updatedRequest.first_name,
            middle_name: updatedRequest.middle_name,
            last_name: updatedRequest.last_name,
            gender: updatedRequest.gender[0].toUpperCase() + updatedRequest.gender.substring(1).toLowerCase(),
            contact_number: updatedRequest.contact_number,
            email: updatedRequest.email,
            role: format_role(updatedRequest.role),
        };

        const url = base_url(req); // pass req to the function

        if (status === "Pending") {
            updatedRequest.approved_by = null;
            updatedRequest.approved_at = null;
            updatedRequest.cancelled_by = null;
            updatedRequest.cancelled_at = null;
        }

        if (status === "Approved") {
            updatedRequest.approved_by = user ? user : updatedSchedule.approved_by;
            updatedRequest.approved_at = storeCurrentDate(0, "hours");
            updatedRequest.cancelled_by = null;
            updatedRequest.cancelled_at = null;
            if (url.includes('localhost') || url.includes('waste-wise-backend-chi.vercel.app')) {
                await request_approval_mailer(updatedRequest.email, formatted_input_data);
            } else if (url.includes('waste-wise-backend-uzub.onrender.com')) {
                await axios.post(`http://waste-wise-backend-chi.vercel.app/otp/request_approval_mailer`, { email: updatedRequest.email, formatted_input_data });
            }
        }

        if (status === "Cancelled") {
            updatedRequest.cancelled_by = user ? user : updatedSchedule.cancelled_by;
            updatedRequest.cancelled_at = storeCurrentDate(0, "hours");
            updatedRequest.approved_by = null;
            updatedRequest.approved_at = null;
            if (url.includes('localhost') || url.includes('waste-wise-backend-chi.vercel.app')) {
                await request_reject_mailer(updatedRequest.email, formatted_input_data);
            } else if (url.includes('waste-wise-backend-uzub.onrender.com')) {
                await axios.post(`http://waste-wise-backend-chi.vercel.app/otp/request_reject_mailer`, { email: updatedRequest.email, formatted_input_data });
            }
        }

        updatedRequest.status = status ? status : updatedRequest.status;

        await updatedRequest.save();

        return res.status(200).json({ data: 'Request successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update request.' });
    }
});

export const update_request = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { first_name, middle_name, last_name, gender, contact_number, password, email, role, barangay, user, status } = req.body;

    try {
        if (!first_name || !middle_name || !last_name || !gender || !contact_number || !password || !email || !role || !barangay || !user || !status) {
            return res.status(400).json({ message: "Please provide all fields (first_name, middle_name, last_name, gender, contact_number, password, email, role, barangay, user, status)." });
        }

        const updatedRequest = await Request.findById(id);

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (status === "Pending") {
            updatedRequest.approved_by = null;
            updatedRequest.approved_at = null;
            updatedRequest.cancelled_by = null;
            updatedRequest.cancelled_at = null;
        }

        if (status === "Approved") {
            updatedRequest.approved_by = user ? user : updatedSchedule.approved_by;
            updatedRequest.approved_at = storeCurrentDate(0, "hours");
            updatedRequest.cancelled_by = null;
            updatedRequest.cancelled_at = null;
        }

        if (status === "Cancelled") {
            updatedRequest.cancelled_by = user ? user : updatedSchedule.cancelled_by;
            updatedRequest.cancelled_at = storeCurrentDate(0, "hours");
            updatedRequest.approved_by = null;
            updatedRequest.approved_at = null;
        }

        updatedRequest.first_name = first_name ? first_name : updatedRequest.first_name;
        updatedRequest.middle_name = middle_name ? middle_name : updatedRequest.middle_name;
        updatedRequest.last_name = last_name ? last_name : updatedRequest.last_name;
        updatedRequest.gender = gender ? gender : updatedRequest.gender;
        updatedRequest.contact_number = contact_number ? contact_number : updatedRequest.contact_number;
        updatedRequest.password = password ? password : updatedRequest.password;
        updatedRequest.email = email ? email : updatedRequest.email;
        updatedRequest.role = role ? role : updatedRequest.role;
        updatedRequest.barangay = barangay ? barangay : updatedRequest.barangay;

        await updatedRequest.save();

        return res.status(200).json({ data: 'Request successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update request.' });
    }
});


export const delete_request = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedRequest = await Request.findByIdAndDelete(id);

        if (!deletedRequest) return res.status(404).json({ message: 'Request not found' });

        return res.status(200).json({ data: 'Request successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete request.' });
    }
});