const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const db = require('../../models'); // Import Sequelize models

// Middleware for form validation (you can move this to a separate validation file if needed)
const validateFormData = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    body('terms').equals('accepted').withMessage('Terms must be accepted'),
];

// GET route to render the signup form
router.get('/', (req, res) => {
    res.render('signup', { title: 'Signup', error: null }); // Initialize error as null or an empty string
});

// POST route to handle form submission
router.post('/', validateFormData, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.render('signup', { title: 'Signup', error: errorMessages.join(', ') });
    }

    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Save the data to MySQL with hashed password
        await db.User.create({ username, email, password: hashedPassword });

        // Redirect to dashboard or any authenticated route
        res.redirect('/user-panel');
    } catch (err) {
        console.error('Error inserting document:', err);
        res.status(500).render('signup', { title: 'Signup', error: 'Error inserting document' });
    }
});

module.exports = router;
