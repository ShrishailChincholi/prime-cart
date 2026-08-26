const authMiddleware = {
    // Check if user is logged in
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        req.flash('error_msg', 'Please login to continue');
        res.redirect('/login');
    },

    // Redirect if logged in
    isGuest: (req, res, next) => {
        if (!req.session.user) {
            return next();
        }
        res.redirect('/');
    },

    // Check if user is admin
    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            return next();
        }
        req.flash('error_msg', 'Access denied. Admin only.');
        res.redirect('/');
    }
};

module.exports = authMiddleware;