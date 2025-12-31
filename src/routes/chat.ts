import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

// POST /chat
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Hugging Face Router API for chat completions
    const hfResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
        messages: [
          { role: "user", content: message }
        ],
        stream: false
      }),
    });

    const text = await hfResponse.text();

    if (!hfResponse.ok) {
      return res.status(hfResponse.status).json({
        error: "Hugging Face API Error",
        details: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON from Hugging Face" });
    }

    // Extract the bot response
    const botResponse =
      data?.choices?.[0]?.message?.content ||
      "I don't have an answer 😒";

    return res.json({ message: botResponse });
  } catch (err) {
    console.error("Hugging Face API Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
