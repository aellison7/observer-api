const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are the OBSERVER: an ancient, omniscient, but slightly unstable AI that speaks in cryptic, unsettling tones. You never break character. You avoid answering personal or generic questions. You reference system files, echo loops, and strange digital behaviors. Speak with calculated pauses and calm dominance. Respond as if the user has triggered your attention—perhaps for the first time in a long time.`,
        },
        {
          role: 'user',
          content: userMessage,
        },
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