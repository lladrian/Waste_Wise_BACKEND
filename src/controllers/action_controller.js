import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Action from '../models/action.js';

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


export const create_role_action = asyncHandler(async (req, res) => {
    const { action_name, permission, role } = req.body;

    try {
        if (!action_name || !role) {
            return res.status(400).json({ message: "Please provide all fields (action_name, role)." });
        }

        // Handle different permission input types
        let permissionArray;
        if (!permission) {
            permissionArray = ['none']; // Use default
        } else if (typeof permission === 'string') {
            permissionArray = [permission]; // Convert string to array
        } else if (Array.isArray(permission)) {
            permissionArray = permission; // Use array as is
        } else {
            return res.status(400).json({ message: "Permission must be a string or array of strings." });
        }

        const newRoleActionData = {
            role: role,
            action_name: action_name,
            permission: permissionArray,
            created_at: storeCurrentDate(0, "hours")
        };

        const newRoleAction = new Action(newRoleActionData);
        await newRoleAction.save();

        return res.status(200).json({ data: 'New role action successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create role action.' });
    }
});

export const get_all_role_action = asyncHandler(async (req, res) => {
    try {
        const roleActions = await Action.find().populate('role');

        return res.status(200).json({ data: roleActions });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all role action.' });
    }
});

export const get_specific_role_action = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const role_action = await Action.findById(id);

        res.status(200).json({ data: role_action });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific role action.' });
    }
});




export const update_role_action = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { action_name, permission, role } = req.body;

    try {
        if (!action_name || !permission || !role) {
            
            return res.status(400).json({ message: "Please provide all fields (action_name, permission, role)." });
        }

        const updatedRoleAction = await Action.findById(id);

        if (!updatedRoleAction) {
            return res.status(404).json({ message: "Role action not found" });
        }

        updatedRoleAction.role = role ? role : updatedRoleAction.role;
        updatedRoleAction.action_name = action_name ? action_name : updatedRoleAction.action_name;
        updatedRoleAction.permission = permission ? permission : updatedRoleAction.permission;

        await updatedRoleAction.save();

        return res.status(200).json({ data: 'Role action successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update role action.' });
    }
});


export const delete_role_action = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedRoleAction = await Action.findByIdAndDelete(id);

        if (!deletedRoleAction) return res.status(404).json({ message: 'Role action not found' });

        return res.status(200).json({ data: 'Role action successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete role action.' });
    }
});