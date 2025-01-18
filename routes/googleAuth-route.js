import express from 'express';
import passport from 'passport';
const router = express.Router();

// router.get('/googlelogin', (req, res) => {
//     res.send("<a href='/auth/google'>Login with Google</a>");
// });

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
});

router.get('/profile', (req, res) => {
    res.send(`Welcome ${req.user.firstName} ${req.user.lastName}`);
});

router.get('/logout', (req, res) => {
    req.logout((e) => {
        if (e) {
            console.log('Error logging out');
        } else {
            console.log('Logged out');
            req.session.destroy(() => {
                res.redirect('/');
            });
        }
    });
});

export default router;
