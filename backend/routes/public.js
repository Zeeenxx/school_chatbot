const express = require('express');
const router = express.Router();
const { Facility } = require('../database/database');

// Public endpoint to get all facilities for the campus map
router.get('/facilities', async (req, res) => {
  try {
    const items = await Facility.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facilities', error });
  }
});

module.exports = router;
