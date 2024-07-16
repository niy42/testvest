const express = require('express');
const router = express.Router();
const db = require('../../models');


// GET route to render the settings page
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming you have stored userId in session after login
        if (!userId) {
            return res.redirect('/login'); // Redirect to login if user is not logged in
        }

        // Find user by userId
        const user = await db.User.findByPk(userId);
        console.log('user detail: ', user);

        if (!user) {
            return res.render('settings', { error: 'User not found' });
        }

        // Render settings page with user data
        res.render('settings', { title: 'Settings', user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;