// Load .env variables
import 'dotenv/config'; // ES module style, works with your "type": "module" in package.json

import express from "express";
import fetch from "node-fetch"; // Make sure you have node-fetch@2 installed

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!DISCORD_BOT_TOKEN || !GUILD_ID) {
  console.error("⚠️ Missing DISCORD_BOT_TOKEN or GUILD_ID in environment variables.");
  process.exit(1);
}

// Endpoint to check if a Discord user is in the server
app.get("/checkDiscordMember", async (req, res) => {
  const { discordId } = req.query;
  if (!discordId) return res.status(400).json({ message: "Missing discordId parameter" });

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    if (response.status === 200) {
      res.json({ isMember: true });
    } else if (response.status === 404) {
      res.json({ isMember: false });
    } else {
      const data = await response.json().catch(() => ({}));
      res.status(response.status).json({ message: data.message || "Unknown error" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to connect to Discord API" });
  }
});

app.listen(PORT, () => {
  console.log(`Discord backend running on port ${PORT}`);
});
