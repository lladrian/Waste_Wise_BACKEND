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
    status: {
        type: String,
        required: false,
        default: "Scheduled"
    },
    remark: {
        type: String,
        required: false,
        default: "None"
    },
    scheduled_collection: {
        type: String,
        default: null
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Schedule', ScheduleSchema);