const mysql = require('mysql2');
const pool = require('../config/db');

const validateBooking = async (req, res, next) => {
    const { carId, pickupDate, returnDate } = req.body;

    if (!carId || !pickupDate || !returnDate) {
        return res.status(400).json({ success: false, message: 'Missing booking details' });
    }

    try {
        const [existingBookings] = await pool.query(
            'SELECT * FROM bookings WHERE car_id = ? AND status != "cancelled" AND ((pickup_date <= ? AND return_date >= ?) OR (pickup_date <= ? AND return_date >= ?) OR (pickup_date >= ? AND return_date <= ?))',
            [carId, pickupDate, pickupDate, returnDate, returnDate, pickupDate, returnDate]
        );

        if (existingBookings.length > 0) {
            return res.status(400).json({ success: false, message: 'Car is not available for the selected dates' });
        }

        next();
    } catch (err) {
        res.status(500).json({ success: false, message: 'Availability check failed', error: err.message });
    }
};

module.exports = validateBooking;
