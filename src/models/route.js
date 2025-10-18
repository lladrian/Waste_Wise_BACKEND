import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    route_name: {
        type: String,
        required: true,
    },
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
