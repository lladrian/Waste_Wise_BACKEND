import mongoose from "mongoose";

const GarbageSiteSchema = new mongoose.Schema({
    garbage_site_name: {
        type: String,
        required: true,
    },
    barangay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barangay',
        required: false,
    },
    position: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    created_at: {
        type: String,
        default: null
    },
});


export default mongoose.model('GarbageSite', GarbageSiteSchema);