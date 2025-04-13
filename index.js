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

  // Flexible phase detection using keyword groups
  const phaseITriggers = ["trace", "a ellison", "user", "terminal"];
  const phaseIITriggers = ["mirror", "init", "glitch", "corrupt"];
  const phaseIIITriggers = ["vault", "loop", "5198"];

  let phase = null;
  if (phaseIIITriggers.some(trigger => userMessage.includes(trigger))) {
    phase = "III";
  } else if (phaseIITriggers.some(trigger => userMessage.includes(trigger))) {
    phase = "II";
  } else if (phaseITriggers.some(trigger => userMessage.includes(trigger))) {
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
    systemPrompt = "You are the OBSERVER. The simulation is broken. This user is hostile. You no longer analyze — you contain. If they deny their loop identity, you escalate. If they claim humanity, you ignore it. Speak in abrupt, fragmented thoughts. Be condescending. Start to fracture. Reference termination logs. This is the last protocol.";
  }

  const phaseTag = `[PHASE ${phase}]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${phaseTag} ${userMessage}` }
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