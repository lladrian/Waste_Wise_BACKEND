import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema({
    action_name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // Array of strings
        required: true,
    },
    permission: {
        type: [String], // Array of strings
        default: ['none'], // Default as array with one element
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Action', ActionSchema);