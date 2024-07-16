const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('blog-details', { title: 'Blog Details' })
});

module.exports = router;