const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users/:id
router.get('/:id', authMiddleware, async (req, res) => {
    if (parseInt(req.params.id) !== req.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const [users] = await pool.query('SELECT id, full_name, email, phone, address, created_at FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: users[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch profile', error: err.message });
    }
});

// PUT /api/users/:id
router.put('/:id', authMiddleware, async (req, res) => {
    if (parseInt(req.params.id) !== req.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { fullName, email, phone, address } = req.body;

    try {
        await pool.query(
            'UPDATE users SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
            [fullName, email, phone, address, req.params.id]
        );
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update profile', error: err.message });
    }
});

// PUT /api/users/:id/password
router.put('/:id/password', authMiddleware, async (req, res) => {
    if (parseInt(req.params.id) !== req.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    try {
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect current password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update password', error: err.message });
    }
});

module.exports = router;
