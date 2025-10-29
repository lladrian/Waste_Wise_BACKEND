import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import CollectorReport from '../models/collector_report.js';
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


export const create_collector_report = asyncHandler(async (req, res) => {
    const { truck, user, latitude, longitude, notes, report_type, specific_issue   } = req.body;

    try {
        if (!latitude || !user || !longitude || !report_type || !specific_issue || !truck) {
            return res.status(400).json({ message: "Please provide all fields (user, latitude, longitude, report_type, specific_issue, truck)." });
        }

        const newCollectorReportData = {
            truck: truck,
            specific_issue: specific_issue,
            user: user,
            notes: notes || null,
            position: {
                lat: latitude,
                lng: longitude
            },
            report_type: report_type,
            created_at: storeCurrentDate(0, "hours")
        };

        const newCollectorReport = new CollectorReport(newCollectorReportData);
        await newCollectorReport.save();

        // await create_notification_many_barangay([barangay], 'barangay_official', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/official/management/report_garbages'); 
        // await create_notification_many_enro_scheduler('enro_staff_scheduler', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/staff/management/report_garbages')
        // await create_notification_many_enro_monitoring('enro_staff_monitoring', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/staff/management/report_garbages')
        // await create_notification_many_enro_head('enro_staff_head', 'A resident has reported uncollected garbage in your area. Please review the report and take appropriate action.', 'report_garbage', 'Uncollected Garbage Report', '/staff/management/report_garbages')
       
        return res.status(200).json({ data: 'New collector report successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create collector report.' });
    }
});

export const get_all_collector_report = asyncHandler(async (req, res) => {
    try {
        const collector_reports = await CollectorReport.find().populate('user').populate('truck');

        return res.status(200).json({ data: collector_reports });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all collector report.' });
    }
});

export const get_all_collector_report_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const collector_reports = await CollectorReport.find({ user: user_id }).populate('user').populate('truck');

        res.status(200).json({ data: collector_reports });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all collector report.' });
    }
});


export const get_specific_collector_report = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const collector_report = await CollectorReport.findById(id).populate('user').populate('truck');

        res.status(200).json({ data: collector_report });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific collector report.' });
    }
});



export const update_collector_report_status = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { status } = req.body;

    try {
        if (!status) {
            return res.status(400).json({ message: "Please provide all fields (status)." });
        }

        const updatedCollectorReport = await CollectorReport.findById(id);

        if (!updatedGarbageReport) {
            return res.status(404).json({ message: "Collector report not found" });
        }

        updatedCollectorReport.resolution_status = status ? status : updatedCollectorReport.resolution_status;
        await updatedCollectorReport.save();

        return res.status(200).json({ data: 'Collector report successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update collector report.' });
    }
});

export const update_collector_report = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user, latitude, longitude, notes, report_type, specific_issue, truck   } = req.body;

    try {
        if (!latitude || !user || !longitude || !report_type || !specific_issue || !truck) {
            return res.status(400).json({ message: "Please provide all fields (user, latitude, longitude, report_type, specific_issue, truck)." });
        }

        const updatedCollectorReport = await CollectorReport.findById(id);

        if (!updatedGarbageReport) {
            return res.status(404).json({ message: "Collector report not found" });
        }

        updatedCollectorReport.user = user ? user : updatedCollectorReport.user;
        updatedCollectorReport.truck = truck ? truck : updatedCollectorReport.truck;
        updatedCollectorReport.notes = notes ? notes : updatedCollectorReport.notes;
        updatedCollectorReport.report_type = report_type ? report_type : updatedCollectorReport.report_type;
        updatedCollectorReport.specific_issue = specific_issue ? specific_issue : updatedCollectorReport.specific_issue;
        updatedCollectorReport.position.lat = latitude ?? updatedCollectorReport.position.lat;
        updatedCollectorReport.position.lng = longitude ?? updatedCollectorReport.position.lng;

        await updatedCollectorReport.save();

        return res.status(200).json({ data: 'Collector report successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update collector report.' });
    }
});


export const delete_collector_report = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedCollectorReport = await CollectorReport.findByIdAndDelete(id);

        if (!deletedCollectorReport) return res.status(404).json({ message: 'Collector report not found' });

        return res.status(200).json({ data: 'Collector report successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete collector report.' });
    }
});