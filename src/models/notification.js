import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notif_content: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: String,
    required: false
  },
  created_at: {
    type: String,
    required: false
  },
});


export default mongoose.model('Notification', NotificationSchema);