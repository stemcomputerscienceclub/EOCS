const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const competitionRoutes = require('./src/routes/competitionRoutes');

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
    },
  },
}));

// Enable compression
app.use(compression());

// Other middleware
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory with caching
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '1d',
    etag: true,
    lastModified: true,
    immutable: process.env.NODE_ENV === 'production'
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eocs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/competition', competitionRoutes);

// API Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EOCS API is running' });
});

// Global Error Handler - Production Ready
app.use((err, req, res, next) => {
    // Log error details in development
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: messages
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'Duplicate field value entered'
        });
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }

    // Default error - hide error details in production
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: process.env.NODE_ENV === 'production' && status === 500
            ? 'Internal Server Error'
            : err.message || 'Server Error'
    });
});

// Serve static files from frontend with caching
app.use(express.static(path.join(__dirname, 'frontend'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

// Handle HTML routes
app.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Home',
        currentPage: 'home'
    });
});

app.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About',
        currentPage: 'about'
    });
});

app.get('/eligibility', (req, res) => {
    res.render('pages/eligibility', {
        title: 'Eligibility',
        currentPage: 'eligibility',
        showSteps: true
    });
});

app.get('/competition', (req, res) => {
    res.render('pages/competition', {
        title: 'Competition',
        currentPage: 'competition'
    });
});

app.get('/prizes', (req, res) => {
    res.render('pages/prizes', {
        title: 'Prizes',
        currentPage: 'prizes',
        showAdditionalInfo: true
    });
});

app.get('/partners', (req, res) => {
    res.render('pages/partners', {
        title: 'Partners',
        currentPage: 'partners',
        showAllPartners: true
    });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Contact',
        currentPage: 'contact'
    });
});

// Auth routes with different layout
app.get('/auth/login', (req, res) => {
    res.render('pages/auth/login', {
        title: 'Login',
        layout: 'layouts/auth'
    });
});

app.get('/auth/register', (req, res) => {
    res.render('pages/auth/register', {
        title: 'Register',
        layout: 'layouts/auth'
    });
});

// Handle 404 - Keep this last
app.get('*', (req, res) => {
    res.status(404).render('pages/404', {
        title: '404 - Page Not Found',
        layout: 'layouts/main'
    });
});

// Server Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown handling
const shutdown = () => {
    console.log('Received shutdown signal. Starting graceful shutdown...');
    server.close(async () => {
        console.log('Closed remaining connections.');
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown();
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    shutdown();
});