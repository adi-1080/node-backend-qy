import twilio from 'twilio';
import nodemailer from 'nodemailer';
import otpModel from '../models/otp-model.js';
import User from '../models/user-model.js';
import jwt from 'jsonwebtoken'

const generateOTP = () => {
    let digits = '0123456789'
    let OTP = ''
    for (let i = 0; i < 4; i++){
        OTP += digits[Math.floor(Math.random() * 10)]
    }
    return OTP;
}

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)
let mailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/ // E.164 phone number format
    return phoneRegex.test(phone);
}

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

const sendOTP = async (req, res) => {
    const { identifier } = req.body; // identifier can be phone or email

    //Send OTP via phone number
    if (isValidPhoneNumber(identifier)) {
        let OTP = generateOTP();
        otpModel.saveOTP(identifier, OTP);

        try {
            await twilioClient.messages.create({
                body: `Your OTP is ${OTP}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: identifier,
            });
            res.status(200).json({message: "OTP sent via SMS"});
        } catch (err) {
            res.status(500).json({message: "Error sending SMS"});
        }
    }
    else if (isValidEmail(identifier)){

        // Check if user is registered
        const user_exists = await User.findOne({$or: [{ email: identifier }, { phone: identifier }]});
        if (!user_exists) {
            return res.status(404).json({message: "User is not registered. Please sign up first."});
        }

        const OTP = generateOTP();
        otpModel.saveOTP(identifier, OTP);

        const mailOptions = {
            from: process.env.EMAIL,
            to: identifier,
            subject: "Your OTP Code",
            text: `Your OTP is ${OTP}`,
        };

        try {
            await mailTransporter.sendMail(mailOptions);
            res.status(200).json({message: "OTP sent via Email"});
        } catch (err) {
            res.status(500).json({message: "Error sending Email"});
        }
    } else {
        res.status(400).json({message: "Invalid identifier (must be phone or email)"});
    }
}

const verifyOTP = async (req, res) => {
    const { identifier, otp } = req.body;
    const isVerified = await otpModel.verifyOTP(identifier, otp);

    if (isVerified) {
        await otpModel.deleteOTP(identifier); // Delete OTP after successful verification
        
        const user = await User.findOne({$or: [{ email: identifier }, { phone: identifier }]});
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const token = jwt.sign({userId: user.id, email: user.email},process.env.SECRET_KEY, {expiresIn: '1h'}
        );

        res.status(200).json({
            message: "OTP verified successfully",
            token: token
        });

    } else {
        res.status(400).json({message: "Invalid OTP"});
    }
}

export default {sendOTP,verifyOTP}