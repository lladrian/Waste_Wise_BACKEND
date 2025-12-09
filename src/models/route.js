import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    route_name: {
        type: String,
        required: true,
    },
    polyline_color: {
        type: String,
        required: false,
        default: "#8B0000"
    },
    route_points: [{
        lat: {
            type: Number,
            required: false,
            default: null
        },
        lng: {
            type: Number,
            required: false,
            default: null
        }
    }],
    merge_barangay: [{
        barangay_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Barangay',
            required: true
        },
        order_index: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    created_at: {
        type: String,
        default: null
    },
});

export default mongoose.model('Route', RouteSchema);
