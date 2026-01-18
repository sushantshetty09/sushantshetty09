const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const validateBooking = require('../middleware/validateBooking');

// POST /api/bookings/
router.post('/', authMiddleware, validateBooking, async (req, res) => {
    const { carId, pickupDate, returnDate, location, totalPrice, additionalOptions } = req.body;
    const userId = req.userId;

    try {
        const [result] = await pool.query(
            'INSERT INTO bookings (user_id, car_id, pickup_date, return_date, pickup_location, total_price, additional_options) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, carId, pickupDate, returnDate, location, totalPrice, JSON.stringify(additionalOptions)]
        );

        res.status(201).json({ success: true, bookingId: result.insertId, message: 'Booking confirmed' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Booking failed', error: err.message });
    }
});

// GET /api/bookings/user/:userId
router.get('/user/:userId', authMiddleware, async (req, res) => {
    if (parseInt(req.params.userId) !== req.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const [bookings] = await pool.query(
            `SELECT b.*, c.name as car_name, c.image_url as car_image 
       FROM bookings b 
       JOIN cars c ON b.car_id = c.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
            [req.params.userId]
        );
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: err.message });
    }
});

// GET /api/bookings/:id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [bookings] = await pool.query(
            `SELECT b.*, c.name as car_name, c.brand as car_brand, c.image_url as car_image 
       FROM bookings b 
       JOIN cars c ON b.car_id = c.id 
       WHERE b.id = ?`,
            [req.params.id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (bookings[0].user_id !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        res.json({ success: true, booking: bookings[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch booking details', error: err.message });
    }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
        if (bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (bookings[0].user_id !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (bookings[0].status !== 'pending' && bookings[0].status !== 'confirmed') {
            return res.status(400).json({ success: false, message: 'Booking cannot be cancelled' });
        }

        await pool.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: err.message });
    }
});

module.exports = router;
