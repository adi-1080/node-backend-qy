import express from 'express';
import passport from 'passport';

import googleAuthController from '../controllers/googleAuth-controller.js';
import authmiddleware from '../middlewares/user-auth.js';

const router = express.Router();

// router.get('/googlelogin', (req, res) => {
//     res.send("<a href='/auth/google'>Login with Google</a>");
// });

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleAuthController.callback);

router.get('/profile', authmiddleware.passAuthUser, googleAuthController.profile);

router.get('/google-logout', googleAuthController.logout);

export default router;
