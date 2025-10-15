import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    route_name: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('Route', RouteSchema);