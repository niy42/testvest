const express = require('express');
const db = require('../../models');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
        };

        const user = await db.User.findByPk(userId);

        if (!user) {
            res.render('plan', { error: 'user not found' });
        }

        res.render('plan', { title: 'Plan', user });
    } catch (error) {
        console.log('Error fetching user details: ', error);
        res.status(500).send('Internal Server Error...');
    }
});

module.exports = router;