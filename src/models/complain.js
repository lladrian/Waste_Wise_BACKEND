import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    complain_content: {
        type: String,
        required: true,
    },
    complain_type: {
        type: String,
        required: true,
    },
    resolution_status: {
        type: String,
        required: false,
        default: "Pending"
    },
    archived: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Complain', ComplainSchema);