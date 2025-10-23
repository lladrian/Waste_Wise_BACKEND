import asyncHandler from 'express-async-handler';
import LoginLog from '../models/login_log.js';

export const get_all_login_log = asyncHandler(async (req, res) => {

    try {
        const logs = await LoginLog.find()
            .populate('user')
            .populate({
                path: 'user',
                populate: {
                    path: 'role_action',
                    model: 'Action'
                }
            });

        return res.status(200).json({ data: logs });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all logs.' });
    }
});


