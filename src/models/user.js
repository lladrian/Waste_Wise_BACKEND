import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    role_action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Action',
        required: false,
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: false,
    },
    is_disabled: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verified_at: {
        type: String,
        default: null
    },
    disabled_at: {
        type: String,
        default: null
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('User', UserSchema);