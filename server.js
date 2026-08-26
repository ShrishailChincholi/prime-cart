require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

// ✅ FIXED: Proper import for connect-mongo
const MongoStorePackage = require('connect-mongo');
const MongoStore = MongoStorePackage.default || MongoStorePackage;

const flash = require('express-flash');
const methodOverride = require('method-override');
const path = require('path');

const connectDB = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/orders');

const app = express();

// ==============================
// View Engine
// ==============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

// ==============================
// Middleware
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ==============================
// Session
// ==============================
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 14 * 24 * 60 * 60
        }),
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000
        }
    })
);

// ==============================
// Flash Messages
// ==============================
app.use(flash());

// ==============================
// ✅ FIXED: Global Variables - Only show non-empty flash messages
// ==============================
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    
    // Get flash messages
    const successMsg = req.flash('success_msg');
    const errorMsg = req.flash('error_msg');
    const error = req.flash('error');
    
    // Only pass if they exist and are not empty
    res.locals.success_msg = successMsg && successMsg.length > 0 ? successMsg[0] : null;
    res.locals.error_msg = errorMsg && errorMsg.length > 0 ? errorMsg[0] : null;
    res.locals.error = error && error.length > 0 ? error[0] : null;
    res.locals.search = '';

    next();
});

// ==============================
// Routes
// ==============================
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// ==============================
// Home Route
// ==============================
app.get('/', (req, res) => {
    res.redirect('/products');
});

// ==============================
// 404 Route
// ==============================
app.use((req, res) => {
    res.status(404).render('pages/404', {
        title: 'Page Not Found'
    });
});

// ==============================
// Connect Database and Start Server
// ==============================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();