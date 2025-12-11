import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cancelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approved_by_role: {
        type: String,
        enum: ['admin', 'resident',
            'enro_staff_monitoring', 'enro_staff_head',
            'enro_staff_scheduler', 'enro_staff_eswm_section_head',
            'barangay_official', 'garbage_collector',
        ],
        default: 'resident',
    },
    cancelled_by_role: {
        type: String,
        enum: ['admin', 'resident',
            'enro_staff_monitoring', 'enro_staff_head',
            'enro_staff_scheduler', 'enro_staff_eswm_section_head',
            'barangay_official', 'garbage_collector',
        ],
        default: 'resident',
    },
    task: [{
        barangay_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Barangay',
            required: false
        },
        order_index: {
            type: Number,
            required: false,
            min: 0
        },
        status: {
            type: String,
            default: null
        },
    }],
    approved_at: {
        type: String,
        default: null
    },
    cancelled_at: {
        type: String,
        default: null
    },
    status: {
        type: String,
        required: false,
        default: "Pending"
    },
    remark: {
        type: String,
        required: false,
        default: "None"
    },
    garbage_type: {
        type: String,
        required: true,
        default: null
    },
    is_editable: {
        type: Boolean,
        default: true
    },
    archived: {
        type: Boolean,
        default: false
    },
    recurring_day: {
        type: String,
        enum: [
            "none",
            "monday", "tuesday", "wednesday",
            "thursday", "friday", "saturday", "sunday"
        ],
        default: "none"
    },
    created_at: {
        type: String,
        default: null
    },
});

ScheduleSchema.virtual("garbage_sites", {
    ref: "GarbageSite",
    localField: "task.barangay_id",
    foreignField: "barangay",
});

ScheduleSchema.set("toObject", { virtuals: true });
ScheduleSchema.set("toJSON", { virtuals: true });


export default mongoose.model('Schedule', ScheduleSchema);