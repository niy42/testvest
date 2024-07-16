const express = require('express');
const router = express.Router();
const db = require('../../models');
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
        };

        // Find by userID
        const user = await db.User.findByPk(userId);
        console.log('user: ', user);

        if (!user) {
            res.render('invest', { error: 'user not found' });
        }

        res.render('invest', { title: 'invest', user });

    } catch (error) {
        console.error('Error fetching data from server: ', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;