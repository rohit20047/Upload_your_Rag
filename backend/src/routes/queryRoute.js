import express from "express";
import { generateRAGResponse } from "../utils/generateRAGResponse.js"; // adjust path if needed

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Query route is working!" });
});

// POST /api/query
router.post("/", async (req, res) => {
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

router.post('/delete-chat', async (req, res) => {
  const { chatId } = req.body;
  if (!chatId) {
    return res.status(400).json({ success: false, message: "Chat ID is required" });
  }

  try {
    await client.query('DELETE FROM chats WHERE chat_id = $1', [chatId]);
    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ success: false, message: "Failed to delete chat" });
  }
});

export default router;
   