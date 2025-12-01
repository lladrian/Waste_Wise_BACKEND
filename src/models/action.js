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
    // permission: [{
    //     permission: {
    //         type: String, // Array of strings
    //         default: 'none', // Default as array with one element
    //     },
    //     capability: {
    //         type: [String], // Array of strings
    //         default: ['none'], // Default as array with one element
    //     },
    // }],
    route: {
        type: [String], // Array of strings
        default: null, // Default as array with one element
    },
    management: {
        type: [String], // Array of strings
        default: null, // Default as array with one element
    },
    permission: {
        type: [String], // Array of strings
        default: null, // Default as array with one element
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Action', ActionSchema);