import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  resident_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResidentUser',
    required: false,
  },
  otp_recovery: {
    type: String,
    required: false
  },
  otp_verification: {
    type: String,
    required: false
  },
  otp_recovery_created: {
    type: String,
    required: false
  },
  otp_verification_created: {
    type: String,
    required: false
  },
});


export default mongoose.model('OTP', OTPSchema);