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
    res.redirect('/profile');
}

const profile = (req, res) => {
    console.log('accessed profile');
    res.send(`Welcome ${req.user.firstName} ${req.user.lastName}`);
}

export default {logout,callback,profile}