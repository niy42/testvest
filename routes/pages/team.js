const express = require('express');
const router = express.Router();

router.get('', (req, res) => (
    res.render('ourteam', { title: 'OurTeam' })
));

module.exports = router;