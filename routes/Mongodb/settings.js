const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config() // environment variables

// GET route to render the settings page
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming you have stored userId in session after login
        if (!userId) {
            return res.redirect('/login'); // Redirect to login if user is not logged in
        }

        const dbName = 'apple';

        const url = process.env.MONGODB_URI;
        if (!url) throw new Error('MongoDB_URI not found!');

        // Connect to database - MongoDB
        const client = await MongoClient.connect(url, {
            authSource: 'admin',
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000
        });

        const db = client.db(dbName); // Database instance

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        console.log('user: ', user)

        if (!user) {
            return res.render('settings', { error: 'User not found' });
        }

        // Render settings page with user data
        res.render('settings', { title: 'Settings', user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;