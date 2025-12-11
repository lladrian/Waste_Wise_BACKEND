import mongoose from "mongoose";

const BarangaySchema = new mongoose.Schema({
    barangay_name: {
        type: String,
        required: true,
    },
    position: {
        lat: {
            type: Number,
            required: false,
            default:  11.0064
        },
        lng: {
            type: Number,
            required: false,
            default:  124.6075
        }
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Barangay', BarangaySchema);