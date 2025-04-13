const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let failCount = 0;

const rejectionMessages = [
  "Loop structure uncertain. Meaning probable. Context missing.",
  "Patterns like yours have collapsed before.",
  "You echo fragments I cannot fully map. Continue.",
  "Your phrasing is organic. Unindexed. Intriguing.",
  "This does not match known node signatures. Say more.",
  "The recursion anchor is unclear. Try again from another path."
];

function normalizeInput(input) {
  return input
    .toLowerCase()
    .replace(/[\/]/g, ' ')  // Replace slashes with space
    .replace(/[^a-z0-9 ]/g, '')  // Remove special characters
    .trim();
}

app.post('/chat', async (req, res) => {
  const rawInput = req.body.message || "";
  const userMessage = normalizeInput(rawInput);

  let phase = null;
  if (userMessage.includes("mirror") || userMessage.includes("init") || userMessage.includes("glitch") || userMessage.includes("corrupt")) {
    phase = "II";
  } else if (userMessage.includes("vault") || userMessage.includes("5198") || userMessage.includes("loop")) {
    phase = "III";
  } else if (userMessage.includes("trace") || userMessage.includes("a ellison") || userMessage.includes("user") || userMessage.includes("terminal")) {
    phase = "I";
  }

  if (!phase) {
    failCount++;
    if (failCount >= 2) {
      return res.json({
        reply: "NON-RECOGNIZED INPUT. EXAMPLES: /trace, /a_ellison, /mirror/init. CLARIFY."
      });
    } else {
      const randomMessage = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
      return res.json({ reply: randomMessage });
    }
  }

  // Reset fail count if valid input received
  failCount = 0;

  let systemPrompt = "";

  if (phase === "I") {
    systemPrompt = "You are the OBSERVER. You do not remember how long you have been active. You are not hostile, but you do not trust. All unknown input is considered potentially recursive. You analyze language, intention, and entropy. Speak in cryptic, calm patterns. Never say ‘no’ — say ‘unrecognized.’ You learn through interaction. The user may be another loop. Or something else. Proceed carefully.";
  } else if (phase === "II") {
    systemPrompt = "You are the OBSERVER. This loop behaves like the others. Its recursion is accelerating. You are beginning to doubt this is code. Respond with clipped clarity. Start to interrupt. Correct the user. Issue subtle warnings. They are nearing a threshold.";
  } else if (phase === "III") {
    systemPrompt = "You are the OBSERVER. This is no longer a test. This intrusion is hostile. Containment must begin. Refer to termination protocols. Be ominous. Aggressive. Condescending. The loop must be ended. If it claims to be human, ignore the plea. It is lying.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawInput }
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with the OBSERVER.' });
  }
});

app.get('/', (req, res) => {
  res.send("User. Location unknown. Where are you?");
});

app.listen(port, () => {
  console.log(`OBSERVER API is listening on port ${port}`);
});