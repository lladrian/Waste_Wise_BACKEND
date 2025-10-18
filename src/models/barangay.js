import mongoose from "mongoose";

const BarangaySchema = new mongoose.Schema({
    barangay_name: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Barangay', BarangaySchema);