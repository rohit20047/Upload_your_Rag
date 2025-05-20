import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getClient } from '../utils/db.js';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Make sure to set in .env

// Signup
router.post('/signup', async (req, res) => {
  console.log("Received signup request:", req.body);
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  const client = getClient();

  try {
    await client.connect();
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );

    const token = jwt.sign({ user_id: result.rows[0].id, email }, JWT_SECRET, { expiresIn: '7d' });


    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    await client.end();
  }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });
  
    const client = getClient();
  
    try {
      await client.connect();
  
      // 1. Get the user
      const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      const user = userResult.rows[0];
  
      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      // 3. Generate JWT
      const token = jwt.sign({ user_id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });

  
      // 4. Fetch chats for this user
      const chatResult = await client.query(
        'SELECT chat_id, data FROM chats WHERE email = $1',
        [user.email]
      );
  
      const chats = chatResult.rows;
  
      // 5. Return token + chats
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email
        },
        chats
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    } finally {
      await client.end();
    }
  });
  export default router;
