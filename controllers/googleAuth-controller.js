const logout = (req, res) => {
    req.logout((e) => {
        if (e) {
            console.log('Error logging out');
        } else {
            console.log('Logged out');
            req.session.destroy(() => {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        }
    });
}

const callback = (req, res) => {
    console.log('Called auth/google/callback');

    if (req.user && req.user.token) {
        const token = req.user.token;

        // Store the token in a cookie
        res.cookie('google_auth_token', token, {
            httpOnly: true, // Prevent client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        console.log('Token stored in cookie:', token);
    } else {
        console.error('Token not found in req.user');
    }
    res.redirect('/profile');
}

const profile = (req, res) => {
    console.log('accessed profile');
    res.send(`Welcome ${req.user.firstName} ${req.user.lastName}`);
}

export default {logout,callback,profile}