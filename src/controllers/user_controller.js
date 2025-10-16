import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import User from '../models/user.js';
import OTP from '../models/otp.js';
import LoginLog from '../models/login_log.js';
import Truck from '../models/truck.js';


import credential_mailer from '../mailer/credential_mailer.js'; // Import the mailer utility

import { UAParser } from 'ua-parser-js';


const getDeviceInfo = (req) => {
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        device: result.device.type || 'desktop',
        platform: `${result.os.name} ${result.browser.name}`,
        fullUserAgent: userAgent
    };
};

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


function hashConverterMD5(password) {
    return crypto.createHash('md5').update(String(password)).digest('hex');
}


function create_user_validation(input_data, type) {


    if (type === 'update_user_profile') {
        if (!input_data.first_name ||
            !input_data.middle_name ||
            !input_data.last_name ||
            !input_data.gender ||
            !input_data.contact_number ||
            !input_data.email) {
            return "Please provide all fields (email, first_name, middle_name, last_name, gender, contact_number, role, is_disabled, role_action).";
        }
    }


    if (type === 'update_user') {
        if (!input_data.first_name ||
            !input_data.middle_name ||
            !input_data.last_name ||
            !input_data.gender ||
            !input_data.contact_number ||
            !input_data.email ||
            !input_data.role_action ||
            !input_data.is_disabled ||
            !input_data.role) {
            return "Please provide all fields (email, first_name, middle_name, last_name, gender, contact_number, role, is_disabled, role_action).";
        }
    }

    if (type === 'update_user_resident') {
        if (!input_data.first_name ||
            !input_data.middle_name ||
            !input_data.last_name ||
            !input_data.gender ||
            !input_data.contact_number ||
            !input_data.email ||
            !input_data.is_disabled ||
            !input_data.route ||
            !input_data.role) {
            return "Please provide all fields (email, first_name, middle_name, last_name, gender, contact_number, role, is_disabled).";
        }
    }

    if (type === 'create_user') {
        if (!input_data.first_name ||
            !input_data.middle_name ||
            !input_data.last_name ||
            !input_data.gender ||
            !input_data.contact_number ||
            !input_data.email ||
            !input_data.password ||
            !input_data.role_action ||
            !input_data.role) {
            return "Please provide all fields (email, password, first_name, middle_name, last_name, gender, contact_number, role, role_action).";
        }
    }

    if (type === 'create_user_resident') {
        if (!input_data.first_name ||
            !input_data.middle_name ||
            !input_data.last_name ||
            !input_data.gender ||
            !input_data.contact_number ||
            !input_data.email ||
            !input_data.password ||
            !input_data.route ||
            !input_data.role) {
            return "Please provide all fields (email, password, first_name, middle_name, last_name, gender, contact_number, role, route).";
        }
    }

    return null;
}

async function update_specific_user(id, input_data, type) {
    const updatedUser = await User.findById(id);

    if (!updatedUser) {
        return "User not found";
    }

    if (type === 'user_profile') {
        updatedUser.first_name = input_data.first_name ? input_data.first_name : updatedUser.first_name;
        updatedUser.middle_name = input_data.middle_name ? input_data.middle_name : updatedUser.middle_name;
        updatedUser.last_name = input_data.last_name ? input_data.last_name : updatedUser.last_name;
        updatedUser.gender = input_data.gender ? input_data.gender : updatedUser.gender;
        updatedUser.contact_number = input_data.contact_number ? input_data.contact_number : updatedUser.contact_number;
        updatedUser.email = input_data.email ? input_data.email : updatedUser.email;
    }

    if (type === 'user') {
        updatedUser.first_name = input_data.first_name ? input_data.first_name : updatedUser.first_name;
        updatedUser.middle_name = input_data.middle_name ? input_data.middle_name : updatedUser.middle_name;
        updatedUser.last_name = input_data.last_name ? input_data.last_name : updatedUser.last_name;
        updatedUser.gender = input_data.gender ? input_data.gender : updatedUser.gender;
        updatedUser.contact_number = input_data.contact_number ? input_data.contact_number : updatedUser.contact_number;
        updatedUser.email = input_data.email ? input_data.email : updatedUser.email;
        updatedUser.role = input_data.role ? input_data.role : updatedUser.role;
        updatedUser.role_action = input_data.role_action ? input_data.role_action : updatedUser.role_action;
    }

    if (type === 'resident') {
        updatedUser.first_name = input_data.first_name ? input_data.first_name : updatedUser.first_name;
        updatedUser.middle_name = input_data.middle_name ? input_data.middle_name : updatedUser.middle_name;
        updatedUser.last_name = input_data.last_name ? input_data.last_name : updatedUser.last_name;
        updatedUser.gender = input_data.gender ? input_data.gender : updatedUser.gender;
        updatedUser.contact_number = input_data.contact_number ? input_data.contact_number : updatedUser.contact_number;
        updatedUser.email = input_data.email ? input_data.email : updatedUser.email;
        updatedUser.role = input_data.role ? input_data.role : updatedUser.role;
        updatedUser.route = input_data.route ? input_data.route : updatedUser.route;
    }


    if (type !== 'user_profile') {
        if (input_data.is_disabled === 'true' || input_data.is_disabled === true) {
            updatedUser.is_disabled = input_data.is_disabled ? input_data.is_disabled : updatedUser.is_disabled;
            updatedUser.disabled_at = storeCurrentDate(0, "hours");
        } else {
            updatedUser.is_disabled = false;
            updatedUser.disabled_at = null;
        }
    }

    updatedUser.save();

    return null;
}


function format_role(role) {
    const roleMap = {
        'admin': 'Admin',
        'resident': 'Resident',
        'enro_staff': 'ENRO Staff',
        'enro_staff_head': 'ENRO Staff Head',
        'barangay_official': 'Barangay Official',
        'garbage_collector': 'Garbage Collector'
    };

    return roleMap[role] || role; // Return formatted role or original if not found
}


async function save_new_user(hash_password, input_data) {
    const newUserData = {
        first_name: input_data.first_name,
        middle_name: input_data.middle_name,
        last_name: input_data.last_name,
        gender: input_data.gender,
        contact_number: input_data.contact_number,
        role: input_data.role,
        route: input_data.route,
        password: hash_password,
        email: input_data.email,
        role_action: input_data.role_action,
        created_at: storeCurrentDate(0, 'hours'),
    };

    const newUser = new User(newUserData);
    newUser.save();

    const newOTP = new OTP({
        user: newUser._id
    });

    newOTP.save();

    const formatted_input_data = {
        first_name: input_data.first_name,
        middle_name: input_data.middle_name,
        last_name: input_data.last_name,
        gender: input_data.gender[0].toUpperCase() + input_data.gender.substring(1).toLowerCase(),
        contact_number: input_data.contact_number,
        password: input_data.password,
        email: input_data.email,
        role: format_role(input_data.role),
    };

    if (input_data.role !== 'resident') {
        await credential_mailer(input_data.email, formatted_input_data);
    }
}

export const create_user_resident = asyncHandler(async (req, res) => {
    const { first_name, middle_name, last_name, gender, contact_number, password, email, role, route } = req.body;

    try {
        const input_data = {
            first_name,
            middle_name,
            last_name,
            gender,
            contact_number,
            password,
            email,
            role,
            route
        };

        const validationError = create_user_validation(input_data, 'create_user_resident');

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });

        await save_new_user(hashConverterMD5(password), input_data);

        return res.status(200).json({ data: 'New user account successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user account.' });
    }
});


export const create_user = asyncHandler(async (req, res) => {
    const { first_name, middle_name, last_name, gender, contact_number, password, email, role, role_action } = req.body;

    try {
        const input_data = {
            first_name,
            middle_name,
            last_name,
            gender,
            contact_number,
            password,
            email,
            role,
            role_action
        };

        const validationError = create_user_validation(input_data, 'create_user');

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });

        await save_new_user(hashConverterMD5(password), input_data);

        return res.status(200).json({ data: 'New user account successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user account.' });
    }
});

export const get_all_user = asyncHandler(async (req, res) => {
    try {
        const users = await User.find()
            .populate('role_action')
            .populate('route');

        return res.status(200).json({ data: users });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all users.' });
    }
});


export const get_all_user_truck_driver = asyncHandler(async (req, res) => {
    try {
        // First, get all trucks to see which users are already assigned
        const trucks = await Truck.find().populate('user');
        
        // Extract the user IDs that are already assigned to trucks
        const assignedUserIds = trucks
            .filter(truck => truck.user) // Filter out trucks without users
            .map(truck => truck.user._id.toString()); // Get user IDs as strings

        // Find users that are NOT in the assignedUserIds array
        const users = await User.find({
            _id: { $nin: assignedUserIds },
            role: 'garbage_collector'
        })
        .populate('role_action')
        .populate('route');

        return res.status(200).json({ data: users });
    } catch (error) {
        console.error('Error getting unassigned users:', error);
        return res.status(500).json({ error: 'Failed to get unassigned users.' });
    }
});

export const get_specific_user = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const user = await User.findById(id);

        res.status(200).json({ data: user });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific user.' });
    }
});

export const login_user = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        // Find the user by email
        let user = await User.findOne({ email: email }); // Don't use .lean() here
        const hash = hashConverterMD5(password);
        const deviceInfo = getDeviceInfo(req);


        // Check if the admin exists and if the password is correct
        if (user && user.password == hash) {


            if (user.is_verified === false) {
                const newLoginLog = new LoginLog({
                    user: user._id,
                    status: 'Failed',
                    device: deviceInfo.device,
                    platform: deviceInfo.platform,
                    os: deviceInfo.os,
                    remark: "Verifying Account",
                    created_at: storeCurrentDate(0, 'hours'),
                });

                newLoginLog.save();
                return res.status(200).json({ data: { user: user, logged_in_at: storeCurrentDate(0, 'hours') } });
            }


            if (user.is_disabled === true) {
                const newLoginLog = new LoginLog({
                    user: user._id,
                    status: 'Failed',
                    device: deviceInfo.device,
                    platform: deviceInfo.platform,
                    os: deviceInfo.os,
                    remark: "Disabled Account",
                    created_at: storeCurrentDate(0, 'hours'),
                });

                newLoginLog.save();
                return res.status(200).json({ data: { user: user, logged_in_at: storeCurrentDate(0, 'hours') } });
            }

            const newLoginLog = new LoginLog({
                user: user._id,
                status: 'Success',
                device: deviceInfo.device,
                platform: deviceInfo.platform,
                os: deviceInfo.os,
                remark: "Normal Login",
                created_at: storeCurrentDate(0, 'hours'),
            });

            newLoginLog.save();
            return res.status(200).json({ data: { user: user, logged_in_at: storeCurrentDate(0, 'hours') } });
        }

        if (user) {
            const newLoginLog = new LoginLog({
                user: user._id,
                status: 'Failed',
                device: deviceInfo.device,
                platform: deviceInfo.platform,
                os: deviceInfo.os,
                remark: "Wrong Password",
                created_at: storeCurrentDate(0, 'hours'),
            });

            newLoginLog.save();
        }

        return res.status(400).json({ message: 'Wrong email or password.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to login ' });
    }
});


export const update_user_verified = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { verify } = req.body;

    try {
        if (!verify) {
            return res.status(400).json({ message: "Please provide all fields (verify)." });
        }

        const updatedUserVerify = await User.findById(id);
        const deviceInfo = getDeviceInfo(req);


        if (!updatedUserVerify) {
            return "User not found";
        }

        if (verify === true || verify === 'true') {
            const log = await LoginLog.find({ user: id, remark: "First Login" });

            if (log.length === 0) {
                const newLoginLog = new LoginLog({
                    user: id,
                    status: 'Success',
                    device: deviceInfo.device,
                    platform: deviceInfo.platform,
                    os: deviceInfo.os,
                    remark: "First Login",
                    created_at: storeCurrentDate(0, 'hours'),
                });

                newLoginLog.save();
            }

            updatedUserVerify.is_verified = verify ? verify : updatedUserVerify.is_verified;
            updatedUserVerify.verified_at = storeCurrentDate(0, "hours");

            await updatedUserVerify.save();
        } else {
            updatedUserVerify.is_verified = false;
            updatedUserVerify.verified_at = null;

            await updatedUserVerify.save();
        }

        return res.status(200).json({ data: 'User account successfully verified.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to verify user account.' });
    }
});



export const update_user_resident = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { first_name, middle_name, last_name, gender, contact_number, email, role, is_disabled, route } = req.body;

    try {
        const input_data = {
            first_name,
            middle_name,
            last_name,
            gender,
            contact_number,
            email,
            role,
            route,
            is_disabled
        };

        const validationError = create_user_validation(input_data, 'update_user_resident');

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updateSpecificUser = await update_specific_user(id, input_data, 'resident');

        if (updateSpecificUser) {
            return res.status(400).json({ message: updateSpecificUser });
        }

        return res.status(200).json({ data: 'User account successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user account.' });
    }
});


export const update_user = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { first_name, middle_name, last_name, gender, contact_number, email, role, is_disabled, role_action } = req.body;

    try {
        const input_data = {
            first_name,
            middle_name,
            last_name,
            gender,
            contact_number,
            email,
            role,
            role_action,
            is_disabled
        };

        const validationError = create_user_validation(input_data, 'update_user');

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updateSpecificUser = await update_specific_user(id, input_data, 'user');

        if (updateSpecificUser) {
            return res.status(400).json({ message: updateSpecificUser });
        }

        return res.status(200).json({ data: 'User account successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user account.' });
    }
});



export const update_user_profile = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { first_name, middle_name, last_name, gender, contact_number, email } = req.body;

    try {
        const input_data = {
            first_name,
            middle_name,
            last_name,
            gender,
            contact_number,
            email
        };

        const validationError = create_user_validation(input_data, 'update_user_profile');

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (await User.findOne({ email: email, _id: { $ne: id } })) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const updateSpecificUser = await update_specific_user(id, input_data, 'user_profile');

        if (updateSpecificUser) {
            return res.status(400).json({ message: updateSpecificUser });
        }

        return res.status(200).json({ data: 'User account successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user account.' });
    }
});



export const update_user_password_recovery = asyncHandler(async (req, res) => {
    const { password, email } = req.body;

    try {
        if (!password || !email) {
            return res.status(400).json({ message: "All fields are required: (password, email)." });
        }

        const hash = hashConverterMD5(password);
        const updatedUser = await User.findOne({ email });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        updatedUser.password = password ? hash : updatedUser.password;

        await updatedUser.save();

        return res.status(200).json({ data: 'User password reset successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to reset user password.' });
    }
});


export const update_user_password_admin = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "All fields are required: password." });
        }

        const hash = hashConverterMD5(password);
        const updatedUser = await User.findById(id);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        updatedUser.password = password ? hash : updatedUser.password;


        const formatted_input_data = {
            first_name: updatedUser.first_name,
            middle_name: updatedUser.middle_name,
            last_name: updatedUser.last_name,
            gender: updatedUser.gender[0].toUpperCase() + updatedUser.gender.substring(1).toLowerCase(),
            contact_number: updatedUser.contact_number,
            password: password,
            email: updatedUser.email,
            role: format_role(updatedUser.role),
        };

        await credential_mailer(updatedUser.email, formatted_input_data);
        await updatedUser.save();

        return res.status(200).json({ data: 'User password successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user password.' });
    }
});


export const update_user_password = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "All fields are required: password." });
        }

        const hash = hashConverterMD5(password);
        const updatedUser = await User.findById(id);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        updatedUser.password = password ? hash : updatedUser.password;

        await updatedUser.save();

        return res.status(200).json({ data: 'User password successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user password.' });
    }
});


export const delete_user = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        const deletedOTP = await OTP.deleteMany({ user: id });
        const deletedLoginLog = await LoginLog.deleteMany({ user: id });


        if (!deletedUser || !deletedOTP || !deletedLoginLog) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ data: 'User account successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete user account.' });
    }
});