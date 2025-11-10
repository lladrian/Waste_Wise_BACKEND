import mongoose from "mongoose";

const CollectorAttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
    },
    flag: {
        type: Number,
        default: 1
    },
    started_at: {
        type: String,
        default: null
    },
    ended_at: {
        type: String,
        default: null
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('CollectorAttendance', CollectorAttendanceSchema);