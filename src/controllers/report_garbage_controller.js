import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import ReportGarbage from '../models/report_garbage.js';
import User from '../models/user.js';

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


export const create_report_garbage = asyncHandler(async (req, res) => {
    const { user, latitude, longitude, notes, garbage_type   } = req.body;

    try {
        if (!latitude || !user || !longitude || !garbage_type) {
            return res.status(400).json({ message: "Please provide all fields (user, latitude, longitude, garbage_type)." });
        }

        const newReportGarbageData = {
            user: user,
            notes: notes || null,
            position: {
                lat: latitude,
                lng: longitude
            },
            garbage_type: garbage_type,
            created_at: storeCurrentDate(0, "hours")
        };

        const newReportGarbage = new ReportGarbage(newReportGarbageData);
        await newReportGarbage.save();

        return res.status(200).json({ data: 'New report garbage successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create report garbage.' });
    }
});

export const get_all_report_garbage = asyncHandler(async (req, res) => {
    try {
        const report_garbages = await ReportGarbage.find().populate('user');

        return res.status(200).json({ data: report_garbages });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all report garbage.' });
    }
});

export const get_all_report_garbage_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        if (!user_id) {
            return res.status(400).json({ message: "Please provide all fields (user_id)." });
        }

        const report_garbages = await ReportGarbage.find({ user: user_id }).populate('user');

        res.status(200).json({ data: report_garbages });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all report garbage.' });
    }
});

export const get_all_report_garbage_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params; // Get the meal ID from the request parameters

    try {
        if (!barangay_id) {
            return res.status(400).json({ message: "Please provide all fields (barangay_id)." });
        }

        const usersInBarangay = await User.find({ barangay: barangay_id });
        const userIds = usersInBarangay.map(user => user._id);
        const report_garbages = await ReportGarbage.find({ user: { $in: userIds } }).populate('user');

        res.status(200).json({ data: report_garbages });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all report garbage.' });
    }
});

export const get_specific_report_garbage = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const report_garbage = await ReportGarbage.findById(id);

        res.status(200).json({ data: report_garbage });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific report garbage.' });
    }
});

export const update_report_garbage = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user, latitude, longitude, notes, garbage_type } = req.body;

    try {
        if (!latitude || !user || !longitude || !garbage_type) {
            return res.status(400).json({ message: "Please provide all fields (user, latitude, longitude, garbage_type)." });
        }

        const updatedReportGarbage = await ReportGarbage.findById(id);
        updatedReportGarbage.position = garbage_type ? garbage_type : updatedReportGarbage.garbage_type;

        if (!updatedReportGarbage) {
            return res.status(404).json({ message: "Report garbage not found" });
        }

        updatedReportGarbage.user = user ? user : updatedReportGarbage.user;
        updatedReportGarbage.notes = notes ? notes : updatedReportGarbage.notes;
        updatedReportGarbage.garbage_type = garbage_type ? garbage_type : updatedReportGarbage.garbage_type;
        updatedReportGarbage.position.lat = latitude ?? updatedReportGarbage.position.lat;
        updatedReportGarbage.position.lng = longitude ?? updatedReportGarbage.position.lng;

        await updatedReportGarbage.save();

        return res.status(200).json({ data: 'Report garbage successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update report garbage.' });
    }
});


export const delete_report_garbage = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedReportGarbage = await ReportGarbage.findByIdAndDelete(id);

        if (!deletedReportGarbage) return res.status(404).json({ message: 'ReportGarbage not found' });

        return res.status(200).json({ data: 'Report garbage successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete report garbage.' });
    }
});