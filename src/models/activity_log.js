import mongoose from "mongoose";

const LoginLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  os: {
    type: String,
    required: false
  },
  device: {
    type: String,
    required: false
  },
  platform: {
    type: String,
    required: false
  },
  remark: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  created_at: {
    type: String,
    required: false
  },
});


export default mongoose.model('LoginLog', LoginLogSchema);