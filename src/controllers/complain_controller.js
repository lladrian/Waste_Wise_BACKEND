import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Complain from '../models/complain.js';
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


export const create_complain = asyncHandler(async (req, res) => {
    const { barangay, user, complain_content, complain_type } = req.body;

    try {
        if (!barangay || !user || !complain_content || !complain_type) {
            return res.status(400).json({ message: "Please provide all fields (barangay, user, complain_content, complain_type, resolution_status)." });
        }


        const newComplainData = {
            barangay: barangay,
            user: user,
            complain_content: complain_content,
            complain_type: complain_type,
            created_at: storeCurrentDate(0, "hours")
        };

        const newComplain = new Complain(newComplainData);
        await newComplain.save();

        return res.status(200).json({ data: 'New complain successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create complain.' });
    }
});

export const get_all_complain = asyncHandler(async (req, res) => {
    try {
        const complains = await Complain.find()
        .populate('user')
        .populate('verified_by')
        .populate('barangay');

        return res.status(200).json({ data: complains });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all complain.' });
    }
});


export const get_all_complain_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params; // Get the meal ID from the request parameters

    try {
        if (!mongoose.Types.ObjectId.isValid(barangay_id)) {
            return res.status(400).json({ error: 'Invalid barangay ID format.' });
        }

        const complains = await Complain.find({ 
            barangay: new mongoose.Types.ObjectId(barangay_id) 
        })
        .populate('user')
        .populate('verified_by')
        .populate('barangay');

        res.status(200).json({ data: complains });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all complain.' });
    }
});

export const get_specific_complain = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const complain = await Complain.findById(id);

        res.status(200).json({ data: complain });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific complain.' });
    }
});


export const update_complain_verification = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user, status } = req.body;

    try {
        if (!user || !status) {
            return res.status(400).json({ message: "Please provide all fields (user, status)." });
        }

        const updatedComplain = await Complain.findById(id);

        if (!updatedComplain) {
            return res.status(404).json({ message: "Complain not found" });
        }

        if(status === 'Verified') {
            updatedComplain.verified_by = user ? user : updatedComplain.verified_by;
            updatedComplain.verified_at = storeCurrentDate(0, "hours");
        }

        if(status === 'Unverified') {
            updatedComplain.verified_by = null;
            updatedComplain.verified_at = null;

        }

        await updatedComplain.save();

        return res.status(200).json({ data: 'Complain successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update complain.' });
    }
});


export const update_complain = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
     const { barangay, user, complain_content, complain_type, resolution_status, archived } = req.body;

    try {
        if (!barangay || !user || !complain_content || !complain_type || !resolution_status || !archived) {
            return res.status(400).json({ message: "Please provide all fields (barangay, user, complain_content, complain_type, resolution_status, archived)." });
        }

        const updatedComplain = await Complain.findById(id);

        if (!updatedComplain) {
            return res.status(404).json({ message: "Complain not found" });
        }

        updatedComplain.barangay = barangay ? barangay : updatedComplain.barangay;
        updatedComplain.archived = archived ? archived : updatedComplain.archived;
        updatedComplain.user = user ? user : updatedComplain.user;
        updatedComplain.complain_content = complain_content ? complain_content : updatedComplain.complain_content;
        updatedComplain.complain_type = complain_type ? complain_type : updatedComplain.complain_type;
        updatedComplain.resolution_status = resolution_status ? resolution_status : updatedComplain.resolution_status;

        await updatedComplain.save();

        return res.status(200).json({ data: 'Complain successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update complain.' });
    }
});


export const delete_complain = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedComplain = await Complain.findByIdAndDelete(id);

        if (!deletedComplain) return res.status(404).json({ message: 'Complain not found' });

        return res.status(200).json({ data: 'Complain successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete complain.' });
    }
});