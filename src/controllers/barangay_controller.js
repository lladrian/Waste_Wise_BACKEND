import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Barangay from '../models/barangay.js';

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


export const create_barangay = asyncHandler(async (req, res) => {
    const { barangay_name } = req.body;

    try {
        if (!barangay_name) {
            return res.status(400).json({ message: "Please provide barangay_name." });
        }

        const barangayData = {
            barangay_name: barangay_name,
            created_at: storeCurrentDate(0, "hours")
        };

        const newBarangayData = new Barangay(barangayData);
        await newBarangayData.save();

        return res.status(200).json({ data: 'New barangay successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create barangay.' });
    }
});

export const get_all_barangay = asyncHandler(async (req, res) => {
    try {
        const barangays = await Barangay.find();


        return res.status(200).json({ data: barangays });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all barangay.' });
    }
});

export const get_specific_barangay = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const barangay = await Barangay.findById(id);

        res.status(200).json({ data: barangay });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific barangay.' });
    }
});



export const update_barangay = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { barangay_name } = req.body;

    try {
        if (!barangay_name) {
            return res.status(400).json({ message: "Please provide all fields (barangay_name)." });
        }

        const updatedBarangay = await Barangay.findById(id);

        if (!updatedBarangay) {
            return res.status(404).json({ message: "Barangay not found" });
        }

        updatedBarangay.barangay_name = barangay_name ? barangay_name : updatedRoute.barangay_name;

        await updatedBarangay.save();

        return res.status(200).json({ data: 'Barangay successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update barangay.' });
    }
});


export const delete_barangay = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedBarangay = await Barangay.findByIdAndDelete(id);

        if (!deletedBarangay) return res.status(404).json({ message: 'Barangay not found' });

        return res.status(200).json({ data: 'Barangay successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete barangay.' });
    }
});