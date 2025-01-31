import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
  identifier: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  otp: { 
    type: String, 
    required: true 
  },
  otp_type: {
    type: String,
    enum: ['register','login'],
    // required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

// TTL index for automatic expiry of OTP (valid for 10 minutes)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

const OTP = mongoose.model("OTP", otpSchema);

// Save OTP to the database
const saveOTP = async (identifier, otp) => {
  try {
    const existingOtp = await OTP.findOne({ identifier });
    if (existingOtp) {
      // Update OTP if identifier already exists
      existingOtp.otp = otp;
      existingOtp.createdAt = Date.now();
      await existingOtp.save();
    } else {
      // Create a new OTP entry if none exists
      const newOtp = new OTP({ identifier, otp });
      await newOtp.save();
    }
  }catch(err){
    console.error("Error saving OTP:", err);
  }
};

const verifyOTP = async (identifier, otp) => {
  try {
    const otpRecord = await OTP.findOne({ identifier });
    if (!otpRecord) return false;

    // Check if OTP matches and is not expired
    return otpRecord.otp === otp;
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return false;
  }
};

// Delete OTP from the database after verification
const deleteOTP = async (identifier) => {
  try {
    await OTP.deleteOne({ identifier });
  } catch (err) {
    console.error("Error deleting OTP:", err);
  }
};

export default {saveOTP,verifyOTP,deleteOTP}
