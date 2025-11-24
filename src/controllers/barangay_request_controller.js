import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import BarangayRequest from '../models/barangay_request.js';
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


export const create_barangay_request = asyncHandler(async (req, res) => {
    const { barangay, user, notes, request_type } = req.body;

    try {
        if (!barangay || !user || !notes || !request_type) {
            return res.status(400).json({ message: "Please provide all fields (barangay, user, notes, request_type)." });
        }


        const newBarangayRequestData = {
            barangay: barangay,
            user: user,
            notes: notes,
            request_type: request_type,
            created_at: storeCurrentDate(0, "hours")
        };

        const newBarangayRequest = new BarangayRequest(newBarangayRequestData);
        await newBarangayRequest.save();

        return res.status(200).json({ data: 'New barangay request successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create barangay request.' });
    }
});

export const get_all_barangay_request = asyncHandler(async (req, res) => {
    try {
        const barangay_requests = await BarangayRequest.find()
            .populate('user')
            .populate('barangay');

        return res.status(200).json({ data: barangay_requests });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all barangay request.' });
    }
});


export const get_all_barangay_request_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params; // Get the meal ID from the request parameters

    try {
        const barangay_requests = await BarangayRequest.find({
            barangay: barangay_id
        })
            .populate('user')
            .populate('barangay');

        res.status(200).json({ data: barangay_requests });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all barangay request.' });
    }
});

export const get_specific_barangay_request = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const barangay_request = await BarangayRequest.findById(id);

        res.status(200).json({ data: barangay_request });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific barangay request.' });
    }
});


export const update_barangay_request = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { barangay, user, notes, request_type, resolution_status } = req.body;

    try {
        if (!barangay || !user || !notes || !request_type || !resolution_status) {
            return res.status(400).json({ message: "Please provide all fields (barangay, user, notes, request_type, resolution_status)." });
        }

        const updatedBarangayRequest = await BarangayRequest.findById(id);

        if (!updatedBarangayRequest) {
            return res.status(404).json({ message: "Barangay request not found" });
        }

        updatedBarangayRequest.barangay = barangay ? barangay : updatedBarangayRequest.barangay;
        updatedBarangayRequest.user = user ? user : updatedBarangayRequest.user;
        updatedBarangayRequest.request_type = request_type ? request_type : updatedBarangayRequest.request_type;
        updatedBarangayRequest.notes = user ? notes : updatedBarangayRequest.notes;
        updatedBarangayRequest.resolution_status = resolution_status ? resolution_status : updatedBarangayRequest.resolution_status;


        await updatedBarangayRequest.save();

        return res.status(200).json({ data: 'Barangay request successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update barangay request.' });
    }
});


export const delete_barangay_request = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedBarangayRequest = await BarangayRequest.findByIdAndDelete(id);

        if (!deletedBarangayRequest) return res.status(404).json({ message: 'Barangay request not found' });

        return res.status(200).json({ data: 'Barangay request successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete barangay request.' });
    }
});