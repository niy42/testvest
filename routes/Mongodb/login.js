const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient;
const { body, validationResult } = require('express-validator');

const validateLoginData = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be 6 or more characters long'),
]

// Handle GET request for login page
route.get('/', (req, res) => {
    res.render('login');
});

// Handling POST Request for Login Form Submission
route.post('/', validateLoginData, async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.render('login', { title: 'login', error: errorMessages.join(', ') });
    }

    try {
        const url = process.env.MONGODB_URI;
        const dbName = 'apple'; // Database name

        const client = await MongoClient.connect(url, {
            authSource: 'admin',
            socketTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000
        });

        const db = client.db(dbName);
        console.log("db name: ", db.databaseName);

        // Query the database to find the user by username
        const user = await db.collection('users').findOne({ username });
        console.log(user);

        if (!user) {
            // Handle case where no user was found
            res.render('login', { title: 'Login', error: `username not found: ${user} ` })
        } else {
            // User found, do something with the user object
            console.log('User found:', user);
        }

        // Compare the password hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Boolean: ', passwordMatch);

        // If passwords do not match
        if (!passwordMatch) {
            return res.render('login', { title: 'login', error: 'incorrect user password' });

            //return res.status(400).send('Invalid username or password');
        }

        // Set session variable to store user ID
        req.session.userId = user._id;
        console.log(req.session.userId);

        // Redirect to dashboard or any authenticated route
        res.redirect('/user-panel');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        res.status(500).render('login', { title: 'Login', error: 'Error connecting to database' });
    }
});

// Example middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (req.session.userId) {
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.redirect('/mysqllogin'); // Redirect to login page if not logged in
    }
}

// Handle GET request for dashboard (authenticated route)
route.get('/dashboard', requireLogin, (req, res) => {
    res.render('dashboard');
});

module.exports = route;