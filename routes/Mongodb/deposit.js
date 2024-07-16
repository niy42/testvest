const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            res.redirect('/login');
        }

        const url = process.env.MONGODB_URI;
        dbName = 'apple';

        const client = await MongoClient.connect(url, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            authSource: 'admin'
        });

        db = client.db(dbName);
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        console.log({ user });

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