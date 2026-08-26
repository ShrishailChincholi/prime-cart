const User = require('../models/User');

exports.renderLogin = (req, res) => {
    // ✅ Don't pass empty flash messages
    res.render('pages/login', { 
        title: 'Login',
        search: ''
    });
};

exports.renderRegister = (req, res) => {
    res.render('pages/register', { 
        title: 'Register',
        search: ''
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            req.flash('error', 'All fields are required');
            return res.redirect('/register');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters');
            return res.redirect('/register');
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/register');
        }

        // Create user
        const user = new User({ name, email, password });
        await user.save();

        req.flash('success_msg', 'Registration successful! Please login.');
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'Server error. Please try again.');
        res.redirect('/register');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'Please enter email and password');
            return res.redirect('/login');
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Create session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success_msg', 'Login successful!');
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Server error. Please try again.');
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/login');
    });
};