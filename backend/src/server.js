import express from "express";
import cors from 'cors';
import uploadRouter from './routes/uploadRoute.js';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoute.js';
import { getClient } from "./utils/db.js"; // Ensure this path is correct
import { generateRAGResponse } from "./utils/generateRAGResponse.js";
import authRoutes from './routes/authRoutes.js'; 
//import { verifyToken } from './middleware/auth.js';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRouter);
app.use('/api/chats', chatRoutes);
app.use('/api/delete-chat', chatRoutes);
//app.get('/api/save-chat2', async (req, res) => { res.json({ success: true, message: "Chat data saved successfully" });});
// 💬 Save chat data
app.post('/api/save-chat', async (req, res) => {
  const { email, chat_id, data } = req.body;
 
  if (!email || !chat_id || !data) {
    return res.status(400).json({
      success: false,
      message: "Missing email, chat_id, or data in request body"
    });
  }

  const client = getClient();

  try {
    await client.connect();
    const query = `
      INSERT INTO chats (email, chat_id, data)
      VALUES ($1, $2, $3)
    `;
    const values = [email, chat_id, JSON.stringify(data)];
    await client.query(query, values);
    res.status(201).json({ success: true, message: "Chat data saved successfully" });
  } catch (error) {
    console.error("❌ Error saving chat data:", error);
    res.status(500).json({ success: false, message: "Failed to save chat data" });
  } finally {
    await client.end();
  }
 
 //res.json({ success: true, message: "Chat data saved successfully" });
 //res.json({ success: true, message: "Chat data saved successfully" });
});

// 🔍 Query route (already present)
app.post('/api/query', async (req, res) => {
  console.log("Received query:", req.body);
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, message: "Query is required" });
  }

  try {
    const response = await generateRAGResponse(query);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error in /api/query:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// ✅ Update saved column to true
app.patch('/api/save-flag', async (req, res) => {
  const { email, chat_id } = req.body;

  if (!email || !chat_id) {
    return res.status(400).json({
      success: false,
      message: "Missing email or chat_id in request body"
    });
  }

  const client = getClient();

  try {
    await client.connect();
    const query = `
      UPDATE chats
      SET saved = TRUE
      WHERE email = $1 AND chat_id = $2
    `;
    const values = [email, chat_id];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.json({ success: true, message: "Chat marked as saved" });
  } catch (error) {
    console.error("❌ Error updating saved flag:", error);
    res.status(500).json({ success: false, message: "Failed to update saved flag" });
  } finally {
    await client.end();
  }
});


app.get('/api/saved-chats', async (req, res) => {
  const { email } = req.query; // <- read from query

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const client = getClient();

  try {
    await client.connect();
    const query = `
      SELECT chat_id, data
      FROM chats
      WHERE email = $1 AND saved = TRUE
    `;
    const values = [email];
    const result = await client.query(query, values);

    res.json({ success: true, chats: result.rows });
  } catch (error) {
    console.error("❌ Error fetching saved chats:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve chats" });
  } finally {
    await client.end();
  }
});



app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
