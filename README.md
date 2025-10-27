# JARVIS 2.0 - AI Chatbot

**JARVIS 2.0** is an intelligent AI-powered chatbot built with Node.js and powered by Groq's Llama-3.3-70b-versatile language model. It features a dark-themed, interactive web interface with real-time AI responses.

## Features

* 🧠 **Groq AI Integration** - Powered by state-of-the-art Llama-3.3-70b-versatile model
* ⚡ **Lightning Fast** - Instant responses from Groq's ultra-fast inference API
* 🎨 **Modern Dark Theme** - Beautiful cyberpunk-inspired UI with animations
* 💬 **Interactive Chat** - Real-time messaging with typing indicators and timestamps
* 🔄 **Fallback System** - Local knowledge base backup if API is unavailable
* 🚀 **Production Ready** - Fully tested and deployed

## Quick Start

### Prerequisites
- Node.js installed
- Groq API key (free at https://console.groq.com/)

### Installation

```bash
cd JARVIS-2.0
npm install
```

### Configuration

1. Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=8080
```

2. Get your Groq API key:
   - Visit https://console.groq.com/
   - Create a free account
   - Generate an API key

### Running

```bash
node server.js
```

Then open your browser to `http://localhost:8080`

## Project Structure

```
JARVIS-2.0/
├── index.html          # Frontend UI
├── server.js           # Node.js backend server
├── package.json        # Dependencies
├── .env.example        # Environment template
└── .gitignore          # Git configuration
```

## API Endpoints

- `POST /start` - Start the chatbot
- `POST /chat` - Send message to chatbot
- `POST /stop` - Stop the chatbot
- `POST /ai-research` - Direct AI query
- `GET /health` - Health check

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **AI**: Groq API (Llama-3.3-70b-versatile)
- **Styling**: Modern CSS with animations

## Features

### Dark Theme UI
- Cyberpunk-inspired design
- Smooth animations and transitions
- Responsive layout
- Glowing effects and particles

### AI Responses
- Intelligent conversation
- Context-aware answers
- Fallback knowledge base
- Error handling with graceful degradation

### Chat Interface
- Real-time messaging
- Typing indicators
- Message timestamps
- Source badges (AI/Knowledge Base)
- Automatic scrolling

## Known Limitations

- Requires active internet connection for Groq API
- Rate limited by Groq free tier
- No conversation persistence

## Future Enhancements

- Database for conversation history
- Multiple language support
- Custom training data
- Webhook integrations
- WebSocket for real-time updates

## License

MIT License

## Author

Built with ❤️ for intelligent conversations

---

**Repository**: https://github.com/surajpanwar26/JARVIS-2.0
