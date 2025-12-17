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
    heading: {
        type: Number,
        required: false,
        default: 0
    },
    heading_web: {
        type: Number,
        required: false,
        default: 0
    },
    mobile: [{
        lat1: {
            type: String,
            default: null
        },
        lat2: {
            type: String,
            default: null
        },
        lon1: {
            type: String,
            default: null
        },
        lon2: {
            type: String,
            default: null
        },
        heading: {
            type: String,
            default: null
        },
    }],
    web: [{
        lat1: {
            type: String,
            default: null
        },
        lat2: {
            type: String,
            default: null
        },
        lon1: {
            type: String,
            default: null
        },
        lon2: {
            type: String,
            default: null
        },
        heading: {
            type: String,
            default: null
        },
    }],
    position: {
        lat: {
            type: Number,
            required: false,
            default: 11.0064
        },
        lng: {
            type: Number,
            required: false,
            default: 124.6075
        }
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Truck', TruckSchema);