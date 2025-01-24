import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user-model.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const configureGoogleStrategy = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        }, async(accessToken, refreshToken, profile, done) => {
            try{
                const email = profile.emails[0].value;
                let user = await User.findOne({ email });

                if (!user) {
                    user = new User({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email,
                        password: '' // Placeholder password
                    });
                    await user.save();
                }

                // Generate a JWT token
                const token = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.SECRET_KEY, // Your secret key
                    { expiresIn: '1h' } // Token expiration time
                );

                console.log({token: token});

                return done(null, { id: user._id, token });
            }catch(e){
                console.error('Error during Google OAuth:', e);
                return done(e, null);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

export default configureGoogleStrategy;
