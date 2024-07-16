const express = require('express');
const db = require('../../models');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
        }

        // Find by userID
        const user = await db.User.findByPk(userId)
        if (!user) {
            res.render('deposit', { error: 'user not found' });
        };

        // Render deposit page with user data
        res.render('deposit', { title: 'Deposit', user });
    } catch (error) {
        console.error(`Error fetching user data: ${error}`);
        res.status(500).send('Internal Server Error');
    }

});

module.exports = router;