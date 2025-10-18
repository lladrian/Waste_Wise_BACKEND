import mongoose from "mongoose";

const RequestUserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        default: 'male',
    },
    contact_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'resident', 'enro_staff', 'enro_staff_head',
            'barangay_official', 'garbage_collector',
        ],
        default: 'resident',
    },
    barangay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barangay',
        required: false,
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cancelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approved_at: {
        type: String,
        default: null
    },
    cancelled_at: {
        type: String,
        default: null
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('RequestUser', RequestUserSchema);