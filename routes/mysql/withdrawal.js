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

        const user = await db.User.findByPk(userId);

        if (!user) {
            res.render('withdrawal', { error: 'user not found' });
        }

        res.render('withdrawal', { title: 'Withdrawal', user });

    } catch (error) {
        console.error('Error fetching data from server: ', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;