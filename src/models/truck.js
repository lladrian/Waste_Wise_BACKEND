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
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Truck', TruckSchema);