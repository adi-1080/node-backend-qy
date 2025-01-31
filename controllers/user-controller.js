import User from '../models/user-model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const register = async (req, res) => {
    try {
        const email_to_check = req.body.email
        const userExists = await User.findOne({ email: email_to_check })

        if (userExists) {
            return res.status(400).json({ message: `User with email ${email_to_check} already exists!` })
        }

        const hashedPass = await bcrypt.hash(req.body.password, 12);

        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPass
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: savedUser
        });
    } catch (e) {
        console.error('Error during registration:', e);
        res.status(500).json({
            message: "Some error occurred",
            error: e.message,
        });
    }
}

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "No User found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password didn\'t match' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({
            message: 'Login successful',
            token: token
        });

        // Mail transporter setup
        let mailTransporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Email details
        let details = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Login on Quickyearning',
            text: `User with email ${req.body.email} just logged in`
        };

        // Sending email
        mailTransporter.sendMail(details, (err) => {
            if (err) {
                console.log("An error occurred!", err);
            } else {
                console.log('Email has been sent!');
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'An error occurred during login', error });
    }
}

export default { register, login }