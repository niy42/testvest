const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
        };

        const url = process.env.MONGODB_URI;
        if (!url) throw new Error('Configure MONGODB_URI in .env file');

        const dbName = 'apple';

        const client = await MongoClient.connect(url, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            authSource: 'admin'
        });

        db = client.db(dbName);
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        console.log('User object: ', user);

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