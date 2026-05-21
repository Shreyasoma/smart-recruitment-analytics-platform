const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    // Step 1 — get name, email, password, role from request body
    const { name, email, password, role } = req.body;
    // Step 2 — check if email exists
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    // Step 3 — if yes, send error
    if (result.rows.length > 0)
      return res.status(400).json({ message: 'Email already exists' });
    // Step 4 — hash password, insert user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role],
    );
    // Step 5 — send back token
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
    return res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    // Step 1 — get email and password from request body
    const { email, password } = req.body;
    // Step 2 — check if user exists
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    // Step 3 — if no, send error
    if (result.rows.length == 0)
      return res.status(400).json({ message: 'User does not exists' });
    // Step 4 — compare password
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    // Step 5 — if no match, send error
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });
    // Step 6 — create JWT, send token
    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
