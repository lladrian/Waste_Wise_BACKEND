import mongoose from "mongoose";

const CollectorReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
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
        enum: ['vehicle_issue', 'equipment_problem', 'route_issue', 'safety_incident', 'other'],
        default: 'other'
    },
    specific_issue: {
        type: String,
        required: true,
        enum: [
            'truck_breakdown', 
            'engine_failure', 
            'tire_flat', 
            'fuel_empty', 
            'mechanical_failure',
            'equipment_malfunction',
            'route_blocked',
            'road_condition',
            'weather_hazard',
            'safety_concern',
            'other'
        ],
        default: 'other'
    },
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


export default mongoose.model('CollectorReport', CollectorReportSchema);