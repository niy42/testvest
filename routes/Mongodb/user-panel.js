const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

// Assuming your MongoDB connection is already set up
// GET route to render the user-panel page
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming you have stored userId in session after login
        if (!userId) {
            return res.redirect('/login'); // Redirect to login if user is not logged in
        }

        const url = process.env.MONGODB_URI;
        const dbName = 'apple'; // Database name

        const client = await MongoClient.connect(url, {
            authSource: 'admin',
            socketTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000
        });
        const db = client.db(dbName);

        // Find user by userId
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        console.log('user detail: ', user);

        if (!user) {
            return res.render('user-panel', { error: 'User not found' });
        }

        // Render profile page with user data
        res.render('user-panel', { title: 'Dashboard', user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;