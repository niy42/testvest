const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.render('', { error: ' User not found' });
        };

        const url = process.env.MONGODB_URI;
        if (!url) throw new Error('MONGODB URI not found');

        const dbName = 'apple';
        const client = await MongoClient.connect(url, { serverSelectionTimeoutMS: 3000, socketTimeoutMS: 3000, authSource: 'admin' });
        db = client.db(dbName);

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        console.log('Notifications: ', user);

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