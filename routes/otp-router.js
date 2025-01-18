import express from 'express'
const router = express.Router();

import otpController from '../controllers/otp-controller.js'

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

export default router
