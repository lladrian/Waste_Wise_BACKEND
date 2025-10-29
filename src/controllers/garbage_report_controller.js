import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import GarbageReport from '../models/garbage_report.js';
import User from '../models/user.js';
import Notification from '../models/notification.js';


import mongoose from "mongoose";

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




async function create_notification_many_barangay(barangay_ids, user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link || !barangay_ids) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link, barangay_ids)." };
        }

        // Find all users with the specified role
        const users = await User.find({ role: user_role, barangay: { $in: barangay_ids }});

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

async function create_notification_many_enro_head(user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link)." };
        }

        // Find all users with the specified role
        const users = await User.find({ role: user_role, is_disabled: false });

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


async function create_notification_many_enro_monitoring(user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link)." };
        }

        // Find all users with the specified role
        const users = await User.find({ role: user_role, is_disabled: false });

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

async function create_notification_many_enro_scheduler(user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link)." };
        }

        // Find all users with the specified role
        const users = await User.find({ role: user_role, is_disabled: false });

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


export const create_garbage_report = asyncHandler(async (req, res) => {
    const { user, latitude, longitude, notes, garbage_type   } = req.body;

    try {
        if (!latitude || !user || !longitude || !garbage_type) {
            return res.status(400).json({ message: "Please provide all fields (user, latitude, longitude, garbage_type)." });
        }

        const newGarbageReportData = {
            user: user,
            notes: notes || null,
            position: {
                lat: latitude,
                lng: longitude
            },
            garbage_type: garbage_type,
            created_at: storeCurrentDate(0, "hours")
        };

        const newGarbageReport = new GarbageReport(newGarbageReportData);
        await newGarbageReport.save();

        // await create_notification_many_barangay([barangay], 'barangay_official', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/official/management/report_garbages'); 
        // await create_notification_many_enro_scheduler('enro_staff_scheduler', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/staff/management/report_garbages')
        // await create_notification_many_enro_monitoring('enro_staff_monitoring', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/staff/management/report_garbages')
        // await create_notification_many_enro_head('enro_staff_head', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/staff/management/report_garbages')
       
        return res.status(200).json({ data: 'New garbage report successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create garbage report.' });
    }
});

export const get_all_garbage_report = asyncHandler(async (req, res) => {
    try {
        const garbage_reports = await GarbageReport.find()
            .populate({
                path: 'user',
                populate: {
                    path: 'barangay', // populate the barangay inside user
                    model: 'Barangay'
                }
            });

        return res.status(200).json({ data: garbage_reports });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all garbage report.' });
    }
});

export const get_all_garbage_report_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        if (!user_id) {
            return res.status(400).json({ message: "Please provide all fields (user_id)." });
        }

        const garbage_reports = await GarbageReport.find({ user: user_id })
            .populate({
                path: 'user',
                populate: {
                    path: 'barangay', // populate the barangay inside user
                    model: 'Barangay'
                }
            });

        res.status(200).json({ data: garbage_reports });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all garbage report.' });
    }
});

export const get_all_garbage_report_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params; // Get the meal ID from the request parameters

    try {
        if (!barangay_id) {
            return res.status(400).json({ message: "Please provide all fields (barangay_id)." });
        }

        const usersInBarangay = await User.find({ barangay: barangay_id });
        const userIds = usersInBarangay.map(user => user._id);
        const garbage_reports = await GarbageReport.find({ user: { $in: userIds } })
            .populate({
                path: 'user',
                populate: {
                    path: 'barangay', // populate the barangay inside user
                    model: 'Barangay'
                }
            });

        res.status(200).json({ data: garbage_reports });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all garbage report.' });
    }
});

export const get_specific_garbage_report = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const garbage_report = await GarbageReport.findById(id);

        res.status(200).json({ data: garbage_report });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific garbage report.' });
    }
});


export const update_garbage_report_status = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { status } = req.body;

    try {
        if (!status) {
            return res.status(400).json({ message: "Please provide all fields (status)." });
        }

        const updatedGarbageReport = await GarbageReport.findById(id);

        if (!updatedGarbageReport) {
            return res.status(404).json({ message: "Garbage report not found" });
        }

        updatedGarbageReport.resolution_status = status ? status : updatedGarbageReport.resolution_status;
        await updatedGarbageReport.save();

        return res.status(200).json({ data: 'Garbage report successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update garbage report.' });
    }
});

export const update_garbage_report = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user, latitude, longitude, notes, garbage_type } = req.body;

    try {
        if (!latitude || !user || !longitude || !garbage_type) {
            return res.status(400).json({ message: "Please provide all fields (user, latitude, longitude, garbage_type)." });
        }

        const updatedGarbageReport = await GarbageReport.findById(id);

        if (!updatedGarbageReport) {
            return res.status(404).json({ message: "Garbage report not found" });
        }

        updatedGarbageReport.user = user ? user : updatedGarbageReport.user;
        updatedGarbageReport.notes = notes ? notes : updatedGarbageReport.notes;
        updatedGarbageReport.garbage_type = garbage_type ? garbage_type : updatedGarbageReport.garbage_type;
        updatedGarbageReport.position.lat = latitude ?? updatedGarbageReport.position.lat;
        updatedGarbageReport.position.lng = longitude ?? updatedGarbageReport.position.lng;

        await updatedGarbageReport.save();

        return res.status(200).json({ data: 'Garbage report successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update garbage report.' });
    }
});


export const delete_garbage_report = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedGarbageReport = await GarbageReport.findByIdAndDelete(id);

        if (!deletedGarbageReport) return res.status(404).json({ message: 'Garbage report not found' });

        return res.status(200).json({ data: 'Garbage report successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete garbage report.' });
    }
});