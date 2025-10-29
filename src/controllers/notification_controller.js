import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
import Notification from '../models/notification.js';
import User from '../models/user.js';


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


export const create_notification_many = asyncHandler(async (req, res) => {
    const { user_role, notif_content } = req.body;

    try {
        if (!user_role || !notif_content) {
            return res.status(400).json({ message: "All fields are required: (user_role, notif_content)." });
        }

        // Find all users with the specified role
        const users = await User.find({ role: user_role });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found with the specified role." });
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            created_at: storeCurrentDate(0, "hours"),
            is_read: false // Add default values if needed
        }));

        // Bulk insert all notifications at once
        const result = await Notification.insertMany(notifications);

        return res.status(200).json({ data: `Notification successfully sent to ${result.length} users.` });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create notification.' });
    }
});

export const create_notification = asyncHandler(async (req, res) => {
    const { user, notif_content } = req.body;

    try {
        if (!user || !notif_content) {
            return res.status(400).json({ message: "All fields are required: (user, notif_content)." });
        }

        const newNotificationData = {
            user: user,
            notif_content: notif_content,
            created_at: storeCurrentDate(0, "hours")
        };

        const newNotification = new Notification(newNotificationData);
        await newNotification.save();

        return res.status(200).json({ data: 'New notification successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create notification.' });
    }
});


export const get_all_notification_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const notifications = await Notification.find({ user: user_id });

        return res.status(200).json({ data: notifications });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all role action.' });
    }
});

export const update_archive_multiple_notification = asyncHandler(async (req, res) => {
    try {
        const { notif_ids, archive } = req.body; // Accept one or multiple notification IDs (array)
        
        if (!notif_ids || !Array.isArray(notif_ids) || notif_ids.length === 0 || !archive) {
            return res.status(400).json({ message: "All fields are required: (archive, notif_ids)." });
        }

        const result = await Notification.updateMany(
            { _id: { $in: notif_ids } },
            { 
                $set: { 
                    is_archived: archive
                }
            }
        );

        return res.status(200).json({ data: "Notifications marked as read successfully." });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return res.status(500).json({ error: "Failed to mark notifications as read." });
    }
});


export const update_read_multiple_notification = asyncHandler(async (req, res) => {
    try {
        const { notif_ids } = req.body; // Accept one or multiple notification IDs (array)
        
        if (!notif_ids || !Array.isArray(notif_ids) || notif_ids.length === 0) {
            return res.status(400).json({ message: "No notification IDs provided." });
        }

        const result = await Notification.updateMany(
            { _id: { $in: notif_ids } },
            { 
                $set: { 
                    is_read: true,
                    read_at: storeCurrentDate(0, "hours")
                }
            }
        );

        return res.status(200).json({ data: "Notifications marked as read successfully." });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return res.status(500).json({ error: "Failed to mark notifications as read." });
    }
});

export const update_read_specific_notification = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const updatedNotification = await Notification.findById(id);

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        updatedNotification.is_read = true;
        updatedNotification.read_at = storeCurrentDate(0, "hours");

        await updatedNotification.save();

        return res.status(200).json({ data: 'Notification successfully read.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to read specific notification.' });
    }
});


export const update_read_all_notification_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const result = await Notification.updateMany(
            { 
                user: user_id,
                is_read: false // Optional: only update unread notifications
            }, 
            { 
                $set: { 
                    is_read: true,
                    read_at: storeCurrentDate(0, "hours")
                } 
            }
        );

        return res.status(200).json({ data: 'Notification successfully read.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to read notification.' });
    }
});