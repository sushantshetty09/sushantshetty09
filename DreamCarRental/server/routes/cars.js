const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/cars/
router.get('/', async (req, res) => {
    const { type, minPrice, maxPrice, transmission } = req.query;
    let query = 'SELECT * FROM cars WHERE is_available = true';
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }
    if (minPrice) {
        query += ' AND price_per_day >= ?';
        params.push(minPrice);
    }
    if (maxPrice) {
        query += ' AND price_per_day <= ?';
        params.push(maxPrice);
    }
    if (transmission) {
        query += ' AND transmission = ?';
        params.push(transmission);
    }

    try {
        const [cars] = await pool.query(query, params);
        res.json({ success: true, cars });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch cars', error: err.message });
    }
});

// GET /api/cars/featured
router.get('/featured', async (req, res) => {
    try {
        const [cars] = await pool.query('SELECT * FROM cars WHERE is_featured = true LIMIT 4');
        res.json({ success: true, cars });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch featured cars', error: err.message });
    }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
    try {
        const [cars] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (cars.length === 0) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        res.json({ success: true, car: cars[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch car details', error: err.message });
    }
});

module.exports = router;
