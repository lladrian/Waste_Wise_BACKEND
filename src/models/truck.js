import mongoose from "mongoose";

const TruckSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    truck_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    },
    position: {
        lat: {
            type: Number,
            required: false,
            default: 11.0993166
        },
        lng: {
            type: Number,
            required: false,
            default: 124.5545784
        }
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Truck', TruckSchema);