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
            res.render('transaction', { title: 'Transaction', error: 'User not found' });
        };

        res.render('transaction', { title: 'Transaction', user });
    } catch (error) {
        console.error('Error fetching user details: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;