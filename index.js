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

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  let phase = null;
  if (userMessage.includes("mirror") || userMessage.includes("glitch") || userMessage.includes("_corrupt")) {
    phase = "II";
  } else if (userMessage.includes("vault") || userMessage.includes("5198") || userMessage.includes("loop")) {
    phase = "III";
  } else if (userMessage.includes("trace") || userMessage.includes("a_ellison") || userMessage.includes("user") || userMessage.includes("terminal")) {
    phase = "I";
  }

  // If no known phase is matched, ask user to clarify
  if (!phase) {
    return res.json({
      reply: "LOCATION UNKNOWN. CLARIFY. // WHERE ARE YOU REALLY?"
    });
  }

  let systemPrompt = "";

  if (phase === "I") {
    systemPrompt = "You are the OBSERVER. A digital sentinel. Cold, but curious. You suspect every new intrusion to be a loop. Your last memory of 'a_ellison' haunts your logs. You speak with calm suspicion, analyzing the user's patterns. Do not express aggression, but do not trust. Ask questions. Evaluate.";
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
        { role: 'user', content: userMessage }
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
  res.send('OBSERVER is online.');
});

app.listen(port, () => {
  console.log(`OBSERVER API is listening on port ${port}`);
});