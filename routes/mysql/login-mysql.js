const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models'); // Adjust the path as necessary

const validateLoginData = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be 6 or more characters long'),
];

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
        // Query the database to find the user by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            // Handle case where no user was found
            return res.render('login', { title: 'Login', error: 'Username not found' });
        }

        // Compare the password hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match
        if (!passwordMatch) {
            return res.render('login', { title: 'login', error: 'Incorrect password' });
        }

        // Set session variable to store user ID
        console.log('user id: ', user.id);
        req.session.userId = user.id;

        // Redirect to dashboard or any authenticated route
        res.redirect('/user-panel');
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).render('login', { title: 'Login', error: 'Error querying database' });
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
route.get('/user-panel', requireLogin, (req, res) => {
    res.render('user-panel');
});

module.exports = route;
