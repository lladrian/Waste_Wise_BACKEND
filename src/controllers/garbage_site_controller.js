import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import GarbageSite from '../models/garbage_site.js';

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


export const create_garbage_site = asyncHandler(async (req, res) => {
    const { garbage_site_name, barangay, latitude, longitude } = req.body;

    try {
        if (!garbage_site_name || !barangay || !latitude || !longitude) {
            return res.status(400).json({ message: "Please provide all fields (garbage_site_name, barangay, latitude, longitude)." });
        }

        const garbageSiteData = {
            garbage_site_name: garbage_site_name,
            barangay: barangay,
            position: {
                lat: latitude,
                lng: longitude
            },
            created_at: storeCurrentDate(0, "hours")
        };

        const newGarbageSiteDataData = new GarbageSite(garbageSiteData);
        await newGarbageSiteDataData.save();

        return res.status(200).json({ data: 'New garbage site successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create garbage site.' });
    }
});

export const get_all_garbage_site = asyncHandler(async (req, res) => {
    try {
        const garbage_sites = await GarbageSite.find().populate('barangay');

        return res.status(200).json({ data: garbage_sites });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all garbage site.' });
    }
});


export const get_all_garbage_site_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params; // Get the meal ID from the request parameters

    try {
        const garbage_sites = await GarbageSite.find({ barangay: barangay_id }).populate('barangay');

        return res.status(200).json({ data: garbage_sites });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all garbage site.' });
    }
});

export const get_specific_garbage_site = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const garbage_site = await GarbageSite.findById(id).populate('barangay');

        res.status(200).json({ data: garbage_site });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific garbage site.' });
    }
});


export const update_garbage_site = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { garbage_site_name, barangay, latitude, longitude } = req.body;

    try {
        if (!garbage_site_name || !barangay || !latitude || !longitude) {
            return res.status(400).json({ message: "Please provide all fields (garbage_site_name, barangay, latitude, longitude)." });
        }

        const updatedGarbageSite = await GarbageSite.findById(id);

        if (!updatedGarbageSite) {
            return res.status(404).json({ message: "Garbage site not found" });
        }

        updatedGarbageSite.garbage_site_name = garbage_site_name ? garbage_site_name : updatedGarbageSite.garbage_site_name;
        updatedGarbageSite.barangay = barangay ? barangay : updatedGarbageSite.barangay;
        updatedGarbageSite.position.lat = latitude ?? updatedGarbageSite.position.lat;
        updatedGarbageSite.position.lng = longitude ?? updatedGarbageSite.position.lng;

        await updatedGarbageSite.save();

        return res.status(200).json({ data: 'Barangay successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update barangay.' });
    }
});


export const delete_garbage_site = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedGarbageSite = await GarbageSite.findByIdAndDelete(id);

        if (!deletedGarbageSite) return res.status(404).json({ message: 'Garbage site not found' });

        return res.status(200).json({ data: 'Garbage site successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete garbage site.' });
    }
});