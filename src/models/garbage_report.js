import mongoose from "mongoose";

const GarbageReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    notes: {
        type: String,
        required: false,
    },
    report_type: {
        type: String,
        required: true,
        enum: ['uncollected', 'other'],
        default: 'uncollected'
    },
    garbage_type: {
        type: String,
        required: true,
        enum: ['biodegradable', 'non_biodegradable', 'recyclable', 'other'],
        default: 'biodegradable'
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


export default mongoose.model('GarbageReport', GarbageReportSchema);