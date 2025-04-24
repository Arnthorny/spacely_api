require('dotenv').config();
const router = require('express').Router();

// Route for testing
router.get('/status', (req, res) => {
  res.json({ status: 200, message: 'OK' });
});

module.exports = router;
