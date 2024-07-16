const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse url-encoded data
app.use(express.urlencoded({ extended: false }));

// Middleware for session management
app.use(session({
    secret: 'gemstones', // Change this to a secure random string
    resave: false,
    saveUninitialized: false,
}));

// Load environment variables
dotenv.config();

// Check if MONGODB_URI is defined in environment variables
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not found in environment variables');
}

const url = process.env.MONGODB_URI;
const dbName = 'apple'; // Database name

// Connect to MongoDB
let db; // Global variable to hold the database connection

async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(url, {
            authSource: 'admin',
            socketTimeoutMS: 9000,
            serverSelectionTimeoutMS: 9000
        });
        console.log('Connected successfully to MongoDB');
        db = client.db(dbName);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with a failure code
    }
}

connectToMongoDB();

// Serve static files (like CSS)
app.use(express.static('public'));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Assuming 'views' directory contains your EJS files

// Handle GET request for homepage
app.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

// Handle sign up route
const signupRoute = require('./routes/signup');
app.use('/signup', signupRoute);

// Handle login route
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

// Handle user-panel route
const dashboardRoute = require('./routes/user-panel');
app.use('/user-panel', dashboardRoute);

// Handle deposit route
const depositRoute = require('./routes/deposit');
app.use('/deposit', depositRoute);

// Handle withdrawal route
const withdrawalRoute = require('./routes/withdrawal');
app.use('/withdraw', withdrawalRoute);

// Handle invest route
const investRoute = require('./routes/invest');
app.use('/invest', investRoute);

// Handle transaction route
const transactionRoute = require('./routes/transaction');
app.use('/transaction', transactionRoute);

// Handle notifications route
const notificationsRoute = require('./routes/notifications');
app.use('/notifications', notificationsRoute);

// Handle settings route
const settingsRoute = require('./routes/settings');
app.use('/user-info', settingsRoute);

// Handle plan route
const planRoute = require('./routes/plan');
app.use('/plan', planRoute);

// Handle terms route
const termsRoute = require('./routes/terms');
app.use('/terms', termsRoute);

// Handle team route
const ourteamRoute = require('./routes/team');
app.use('/ourteam', ourteamRoute);

// Handle review route
const reviewRoute = require('./routes/review');
app.use('/review', reviewRoute);

// Handle faq route
const faqRoute = require('./routes/faq');
app.use('/faq', faqRoute);

// Handle contact route
const contactRoute = require('./routes/contact');
app.use('/contact', contactRoute);

// Handle about route
const aboutRoute = require('./routes/about');
app.use('/about', aboutRoute);

// Handle blog route
const blogRoute = require('./routes/blog');
app.use('/blog', blogRoute);

//Handle blog-details route
const blogdetailsRoute = require('./routes/blog-details');
app.use('/blogdetails', blogdetailsRoute);

// Handle GET request for logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});