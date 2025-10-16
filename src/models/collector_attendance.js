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
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
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