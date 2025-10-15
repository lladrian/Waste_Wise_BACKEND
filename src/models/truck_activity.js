import mongoose from "mongoose";

const TruckActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
    },
    start_point: {
        type: String,
        required: false,
    },
    end_point: {
        type: String,
        required: false,
    },
    longitude: {
        type: String,
        required: false,
    },
    latitude: {
        type: String,
        required: false,
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


export default mongoose.model('TruckActivity', TruckActivitySchema);