# OBSERVER API

This is the backend for the OBSERVER AI used on run7.org. It connects to OpenAI's GPT model and speaks in character as the OBSERVER.

## Setup

1. Clone this repo to your GitHub.
2. On Render, connect this repo as a Web Service.
3. Set your environment variable: `OPENAI_API_KEY` with your actual OpenAI key.
4. Deploy.

## Endpoint

POST /chat

Send: `{ "message": "your input" }`  
Receive: `{ "reply": "OBSERVER's response" }`