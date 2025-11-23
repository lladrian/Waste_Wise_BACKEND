import mongoose from "mongoose";

const BarangayRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    barangay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barangay',
    },
    notes: {
        type: String,
        required: false,
    },
    request_type: {
        type: String,
        required: false,
        enum: ["request_help", "request_new_schedule", "request_new_truck"],
        default: 'request_help'
    },
    responses: [
        {
            message: { type: String, required: false },
            responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            created_at: { type: String, default: null }
        }
    ],
    resolution_status: {
        type: String,
        required: false,
        default: "Pending"
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('BarangayRequest', BarangayRequestSchema);