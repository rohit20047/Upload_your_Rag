import express from 'express';
import { getChatsByUserId } from '../services/chatService.js';
import { getClient } from '../utils/db.js';

const router = express.Router();

router.get('/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const chats = await getChatsByUserId(email);
    res.json({ success: true, data: chats });
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch chats' });
  }
});
router.post('/', async (req, res) => {
  const { chatId } = req.body;
  if (!chatId) {
    return res.status(400).json({ success: false, message: "Chat ID is required" });
  }

  try {
    const client = getClient();
    await client.connect();
    await client.query('DELETE FROM chats WHERE chat_id = $1', [chatId]);
    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ success: false, message: "Failed to delete chat" });
  }
});

export default router;
