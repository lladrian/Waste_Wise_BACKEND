import mongoose from "mongoose";

const CollectorAttendanceSchema = new mongoose.Schema({
    action_name: {
        type: String,
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


export default mongoose.model('CollectorAttendance', CollectorAttendanceSchema);