import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './db/connect-db.js';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import configureGoogleStrategy from './config/passport-google.js';
import googleAuthRoute from './routes/googleAuth-route.js';
import userRoute from './routes/user-route.js';
import usercontactRoute from './routes/usercontact-router.js';
import otpRoute from './routes/otp-router.js';
import stockRoute from './routes/stock-route.js';

dotenv.config();
connectDB();

const app = express();
const HOST_NAME = 'localhost';
const PORT_NO = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    try {
        res.status(200).json({ message: 'Home Page' });
    } catch (e) {
        res.status(500).json({ message: 'Some internal error occurred' });
    }
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure Google Strategy
configureGoogleStrategy(passport);

// Routes
app.use(googleAuthRoute);
app.use('/user', userRoute);
app.use('/usercontact', usercontactRoute);
app.use('/otp', otpRoute);
app.use('/stock', stockRoute);

app.listen(PORT_NO, () => {
    console.log(`Server is running on http://${HOST_NAME}:${PORT_NO}`);
});
