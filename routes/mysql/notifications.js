const express = require('express');
const router = express.Router();
const db = require('../../models');
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.render('', { error: ' User not found' });
        };

        const user = await db.User.findByPk(userId);

        if (!user) {
            res.render('notifications', { error: 'User not found' });
        };

        res.render('notifications', { title: 'Notifications', user });
    } catch (error) {
        console.error('Error fetching user details: ', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;