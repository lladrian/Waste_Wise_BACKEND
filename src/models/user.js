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
        enum: ['admin', 'resident',
            'enro_staff_monitoring', 'enro_staff_head',
            'enro_staff_scheduler', 'enro_staff_eswm_section_head',
            'barangay_official', 'garbage_collector',
        ],
        default: 'resident',
    },
    role_action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Action',
        required: false,
        default: null
    },
    barangay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barangay',
        required: false,
        default: null
    },
    garbage_site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GarbageSite',
        required: false,
        default: null
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