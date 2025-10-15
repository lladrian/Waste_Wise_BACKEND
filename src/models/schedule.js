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
    status: {
        type: String,
        required: false,
        default: "Not Yet"
    },
    remark: {
        type: String,
        required: false,
        default: "Not Yet"
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