import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Schedule from '../models/schedule.js';
import Notification from '../models/notification.js';
import User from '../models/user.js';
import Route from '../models/route.js';
import { io } from '../config/connect.js';
import CollectorAttendance from '../models/collector_attendance.js';

import axios from "axios";

async function broadcastList(name, data) {
    const message = JSON.stringify({ name, data });

    io.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
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


  function getTodayDayName() {
    const now = new Date();
    // Convert to Philippines time (UTC+8)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const philippinesTime = new Date(utc + 8 * 3600000);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[philippinesTime.getDay()];

    return dayName.toLowerCase();
  }

const getPhilippineDate = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' });
    return formatter.format(now); // YYYY-MM-DD in PH timezone
};

async function create_notification_many_garbage_collector(id, user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link)." };
        }

        // Find all users with the specified role
        const users = await User.find({
            multiple_role: { $elemMatch: { role: user_role } },
            is_disabled: false,
            _id: id
        });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            category: category,
            role: user_role,
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

async function create_notification_many_admin(user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link)." };
        }

        // Find all users with the specified role
        const users = await User.find({
            multiple_role: { $elemMatch: { role: user_role } },
            is_disabled: false
        });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            role: user_role,
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
        const users = await User.find({
            multiple_role: { $elemMatch: { role: user_role } },
            is_disabled: false
        });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            category: category,
            role: user_role,
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
        const users = await User.find({
            multiple_role: { $elemMatch: { role: user_role } },
            is_disabled: false
        });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            category: category,
            role: user_role,
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

async function create_notification_many_resident(barangay_ids, user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link || !barangay_ids) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link, barangay_ids)." };
        }

        // Find all users with the specified role
        const users = await User.find({
            multiple_role: { $elemMatch: { role: user_role } },
            barangay: { $in: barangay_ids }
        });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            role: user_role,
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

async function create_notification_many_barangay(barangay_ids, user_role, notif_content, category, title, link) {
    try {
        if (!user_role || !notif_content || !category || !title || !link || !barangay_ids) {
            return { message: "All fields are required: (user_role, notif_content, category, title, link, barangay_ids)." };
        }

        // Find all users with the specified role
        const users = await User.find({
            multiple_role: { $elemMatch: { role: user_role } },
            barangay: { $in: barangay_ids }
        });

        if (!users || users.length === 0) {
            return { message: "No users found with the specified role." };
        }

        // Prepare notifications array for bulk insert
        const notifications = users.map(user => ({
            user: user._id,
            notif_content: notif_content,
            title: title,
            category: category,
            role: user_role,
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

function base_url(req) {
    const protocol = req.protocol; // "http" or "https"
    const host = req.get("host");  // e.g., "waste-wise-backend-uzub.onrender.com"
    const baseUrl = `${protocol}://${host}`;
    return baseUrl;
}




export const create_schedule = asyncHandler(async (req, res) => {
    const { route, truck, user, garbage_type, task, recurring_day } = req.body;

    try {
        if (!route || !truck || !user || !garbage_type || !task || !Array.isArray(recurring_day) || recurring_day.length === 0) {
            return res.status(400).json({ message: "Please provide all fields (route, truck, user, garbage_type, task, recurring_day)." });
        }

        if (await Schedule.findOne({ user: user, truck: truck, route: route })) return res.status(400).json({ message: 'Schedule already exists' });

        const routeData = await Route.findById(route);
        const barangayIds = routeData.merge_barangay.map(b => b.barangay_id);

        const newScheduleData = {
            task: task,
            garbage_type: garbage_type,
            route: route,
            truck: truck,
            recurring_day: recurring_day,
            user: user,
            created_at: storeCurrentDate(0, "hours")
        };

        const newSchedule = new Schedule(newScheduleData);

        await newSchedule.save();

        await create_notification_many_garbage_collector(user, 'garbage_collector', 'A new waste collection schedule has been created. Please review the schedule details.', 'schedule', 'New Schedule Created', '/collector/collector-schedule');
        await create_notification_many_resident(barangayIds, 'resident', 'A new waste collection schedule has been created. Please review the schedule details.', 'schedule', 'New Schedule Created', '/official/management/schedules');
        await create_notification_many_barangay(barangayIds, 'barangay_official', 'A new waste collection schedule has been created. Please review the schedule details.', 'schedule', 'New Schedule Created', '/official/management/schedules');
        await create_notification_many_enro_head('enro_staff_head', 'A new waste collection schedule has been created. Please review the schedule details.', 'schedule', 'New Schedule Created', '/staff/management/schedules');
        await create_notification_many_admin('admin', 'A new waste collection schedule has been created. Please review the schedule details.', 'schedule', 'New Schedule Created', '/admin/management/schedules');

        return res.status(200).json({ data: 'New schedule successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create schedule.' });
    }
});

export const get_all_schedule_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params;

    try {
        const schedules = await Schedule.find()
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('user')
            .populate('approved_by')
            .populate('cancelled_by')

        const filteredSchedules = schedules.filter(schedule => {
            const mergeBarangays = schedule?.route?.merge_barangay;
            if (!Array.isArray(mergeBarangays)) return false;

            return mergeBarangays.some(item => {
                const id = item?.barangay_id?._id || item?.barangay_id; // handle populated/unpopulated
                return id?.toString() === barangay_id.toString();
            });
        });

        return res.status(200).json({ data: filteredSchedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return res.status(500).json({ error: 'Failed to get schedules for barangay.' });
    }
});




export const get_all_schedule_current_day_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    try {
        // First get all schedules for today
        const allSchedules = await Schedule.find({ recurring_day: getTodayDayName() })
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id',
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('garbage_sites')
            .populate('user')
            .populate('approved_by')
            .populate('cancelled_by');

        // Then filter by user ID
        const filteredSchedules = allSchedules.filter(schedule =>
            schedule.truck &&
            schedule.truck.user &&
            schedule.truck.user._id.toString() === user_id
        );

        return res.status(200).json({ data: filteredSchedules });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to get all schedules.' });
    }
});

export const get_all_schedule_current_day = asyncHandler(async (req, res) => {
    try {
        const schedules = await Schedule.find({ recurring_day: getTodayDayName() })
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('garbage_sites')
            .populate('user')
            .populate('approved_by')
            .populate('cancelled_by');

        return res.status(200).json({ data: schedules });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all schedules.' });
    }
});

export const get_all_schedule = asyncHandler(async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate({
                path: 'task',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('garbage_sites')
            .populate('user')
            .populate('approved_by')
            .populate('cancelled_by')




        return res.status(200).json({ data: schedules });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all schedules.' });
    }
});

export const get_specific_schedule = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const schedule = await Schedule.findById(id)
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('user')
            .populate('approved_by')
            .populate('cancelled_by')

        res.status(200).json({ data: schedule });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific schedule.' });
    }
});


export const get_all_schedule_specific_user_garbage_collector = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const schedules = await Schedule.find({ user: user_id })
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('user')
            .populate('approved_by')
            .populate('cancelled_by')

        res.status(200).json({ data: schedules });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all schedule.' });
    }
});



export const update_schedule_opposal = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user } = req.body;

    try {
        if (!user) {
            return res.status(400).json({ message: "Please provide all fields (user)." });
        }

        const updatedSchedule = await Schedule.findById(id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        updatedSchedule.is_editable = is_editable ? is_editable : updatedSchedule.is_editable;
        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;

        await updatedSchedule.save();

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});



export const update_schedule_approval = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { remark, status, is_editable, user, role } = req.body;

    try {
        if (!remark || !status || !is_editable || !user) {
            return res.status(400).json({ message: "Please provide all fields (remark, status, is_editable, user)." });
        }

        const updatedSchedule = await Schedule.findById(id);
        const routeData = await Route.findById(updatedSchedule.route);
        const barangayIds = routeData.merge_barangay.map(b => b.barangay_id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        if (status === "Pending") {
            updatedSchedule.approved_by_role = null;
            updatedSchedule.approved_by = null;
            updatedSchedule.approved_at = null;
            updatedSchedule.cancelled_by_role = null;
            updatedSchedule.cancelled_by = null;
            updatedSchedule.cancelled_at = null;
        }


        if (status === "Scheduled") {
            updatedSchedule.approved_by_role = role ? role : updatedSchedule.approved_by_role;
            updatedSchedule.approved_by = user ? user : updatedSchedule.approved_by;
            updatedSchedule.approved_at = storeCurrentDate(0, "hours");
            updatedSchedule.cancelled_by_role = null;
            updatedSchedule.cancelled_by = null;
            updatedSchedule.cancelled_at = null;
            await create_notification_many_garbage_collector(updatedSchedule.user, 'garbage_collector', 'The waste collection schedule has been approved. Please review the updated details', 'schedule', 'New Schedule Created', '/collector/collector-schedule');
            await create_notification_many_enro_scheduler('enro_staff_scheduler', 'The waste collection schedule has been approved. Please review the updated details.', 'schedule', 'Schedule Approved', '/staff/management/schedules');
            await create_notification_many_barangay(barangayIds, 'barangay_official', 'The waste collection schedule has been approved. Please review the updated details.', 'schedule', 'Schedule Approved', '/official/management/schedules');
        }

        if (status === "Cancelled") {
            updatedSchedule.cancelled_by_role = role ? role : updatedSchedule.cancelled_by_role;
            updatedSchedule.cancelled_by = user ? user : updatedSchedule.cancelled_by;
            updatedSchedule.cancelled_at = storeCurrentDate(0, "hours");
            updatedSchedule.approved_by_role = null;
            updatedSchedule.approved_by = null;
            updatedSchedule.approved_at = null;
            await create_notification_many_enro_scheduler('enro_staff_scheduler', 'The waste collection schedule has been cancelled. Please review the updated details.', 'schedule', 'Schedule Cancelled', '/staff/management/schedules');
            await create_notification_many_barangay(barangayIds, 'barangay_official', 'The waste collection schedule has been cancelled. Please review the updated details.', 'schedule', 'Schedule Cancelled', '/official/management/schedules');
        }

        updatedSchedule.is_editable = is_editable ? is_editable : updatedSchedule.is_editable;
        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;


        await updatedSchedule.save();

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});


export const update_schedule = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { route, truck, recurring_day, remark, status, garbage_type, task } = req.body;

    try {
        if (!route || !truck || !recurring_day || !remark || !status || !garbage_type || !task) {
            return res.status(400).json({ message: "Please provide all fields (route, truck, recurring_day, remark, status, garbage_type, task)." });
        }

        if (await Schedule.findOne({ _id: { $ne: id }, truck: truck, recurring_day: recurring_day, route: route })) return res.status(400).json({ message: 'Schedule already exists' });

        const updatedSchedule = await Schedule.findById(id);
        const routeData = await Route.findById(route);
        const barangayIds = routeData.merge_barangay.map(b => b.barangay_id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        updatedSchedule.task = task ? task : updatedSchedule.task;
        updatedSchedule.garbage_type = garbage_type ? garbage_type : updatedSchedule.garbage_type;
        updatedSchedule.route = route ? route : updatedSchedule.route;
        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;
        updatedSchedule.truck = truck ? truck : updatedSchedule.truck;
        updatedSchedule.recurring_day = recurring_day ? recurring_day : updatedSchedule.recurring_day;

        await updatedSchedule.save();

        await create_notification_many_enro_head('enro_staff_head', 'The waste collection schedule has been updated. Please check the new details.', 'schedule', 'Schedule Updated', '/staff/management/schedules');
        await create_notification_many_admin('admin', 'The waste collection schedule has been updated. Please check the new details.', 'schedule', 'Schedule Updated', '/admin/management/schedules');
        await create_notification_many_barangay(barangayIds, 'barangay_official', 'The waste collection schedule has been updated. Please check the new details.', 'schedule', 'Schedule Updated', '/official/management/schedules');

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});


export const update_schedule_garbage_collector = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { remark, status } = req.body;

    try {
        if (!remark || !status) {
            return res.status(400).json({ message: "Please provide all fields (remark, status)." });
        }

        const updatedSchedule = await Schedule.findById(id);
        const routeData = await Route.findById(updatedSchedule.route);
        const barangayIds = routeData.merge_barangay.map(b => b.barangay_id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }


        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;

        await updatedSchedule.save();
        await create_notification_many_barangay(barangayIds, 'barangay_official', 'The schedule has been marked. Please review the details.', 'schedule', 'The Schedule Marked', '/official/management/schedules');

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});

export const update_schedule_garbage_collection_status = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { task_updates } = req.body;

    try {
        if (!task_updates) {
            return res.status(400).json({ message: "Please provide all fields (task_updates)." });
        }

        const updatedSchedule = await Schedule.findById(id);
        const url = base_url(req); // pass req to the function


        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        if (task_updates && Array.isArray(task_updates)) {
            task_updates.forEach(task_update => {
                const task = updatedSchedule.task.id(task_update.task_id);
                if (task) {
                    task.status = task_update.status;
                }
            });
        }


        await updatedSchedule.save();

        const collector_attendances = await CollectorAttendance.findOne({ user: updatedSchedule.user._id, flag: 1 })
            .populate({
                path: 'schedule',
                populate: {
                    path: 'route',
                    populate: {
                        path: 'merge_barangay.barangay_id',
                        model: 'Barangay'
                    }
                }
            })
            .populate({
                path: 'schedule',
                populate: {
                    path: 'task.barangay_id',
                    model: 'Barangay'
                }
            })
            .populate('truck')
            .populate('user')
            .sort({ created_at: -1 });


        const schedules = await Schedule.find({ recurring_day: getTodayDayName() })
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('garbage_sites');





        if (url.includes('localhost') || url.includes('waste-wise-backend-chi.vercel.app')) {
            const response = await axios.post(`http://waste-wise-backend-uzub.onrender.com/web_sockets/get_web_socket_attendance`, { user: updatedSchedule.user._id, flag: 1 });
            const response2 = await axios.post(`http://waste-wise-backend-uzub.onrender.com/web_sockets/get_web_socket_schedule`, { recurring_day: getTodayDayName() });
        } else if (url.includes('waste-wise-backend-uzub.onrender.com')) {
            await broadcastList('attendance', collector_attendances);
            await broadcastList('trucks', schedules);
        }

        return res.status(200).json({ message: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
})

export const delete_schedule = asyncHandler(async (req, res) => {

    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(id);

        if (!deletedSchedule) return res.status(404).json({ message: 'Schedule not found' });

        return res.status(200).json({ data: 'Schedule successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete schedule.' });
    }
});