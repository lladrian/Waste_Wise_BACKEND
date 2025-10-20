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
    scheduled_collection: {
        type: String,
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
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Schedule', ScheduleSchema);