const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
            [fullName, email, phone, hashedPassword]
        );

        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your_super_secret_key_here',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
});

// GET /api/auth/verify
router.get('/verify', async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');
        res.json({ valid: true, userId: decoded.id });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
