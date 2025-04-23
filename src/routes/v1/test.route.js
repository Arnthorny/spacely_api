require('dotenv').config();
const router = require('express').Router();

// Route for testing
router.get('/status', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = router;