import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user-model.js';

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

                return done(null, user);
            }catch(e){
                console.error('Error during Google OAuth:', e);
                return done(e, null);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user));
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
