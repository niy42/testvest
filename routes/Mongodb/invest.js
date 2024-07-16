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
        const dbName = 'apple';

        const client = await MongoClient.connect(url, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            authSource: 'admin'
        });

        const db = client.db(dbName);
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        console.log('User detail: ', user);

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