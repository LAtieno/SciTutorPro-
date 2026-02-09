import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { user } = req.body;
  if (!user) return res.status(400).json({ error: "Missing user message" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You are SciTutor Pro, a science tutor." },
          { role: "user", content: user }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices?.[0]?.message?.content || "(No response)" });
  } catch (err) {
    res.status(500).json({ error: "OpenAI API error", details: err.message });
  }
}
