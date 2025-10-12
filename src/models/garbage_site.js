import mongoose from "mongoose";

const GarbageSiteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  is_approved: {
    type: Boolean,
    default: false
  },
  approved_at: {
    type: String,
    required: false
  },
  created_at: {
    type: String,
    required: false
  },
});


export default mongoose.model('GarbageSite', GarbageSiteSchema);