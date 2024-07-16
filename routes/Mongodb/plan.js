const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
        };

        const url = process.env.MONGODB_URI;
        if (!url) throw new Error('MONGODB_URI not found');

        const dbName = 'apple';
        const client = await MongoClient.connect(url, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            authSource: 'admin'
        });

        const db = client.db(dbName);
        const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });

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