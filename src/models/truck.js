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
    },
    // is_hidden: {
    //     type: Boolean,
    //     default: false
    // },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Truck', TruckSchema);