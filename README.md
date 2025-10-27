# JARVIS 2.0 - AI Chatbot

**JARVIS 2.0** is an intelligent AI-powered chatbot built with Node.js and powered by advanced AI language models. It features a dark-themed, interactive web interface with real-time AI responses.

## Features

* 🧠 **AI Integration** - Powered by advanced language models
* ⚡ **Lightning Fast** - Instant responses with optimized inference
* 🎨 **Modern Dark Theme** - Beautiful cyberpunk-inspired UI with animations
* 💬 **Interactive Chat** - Real-time messaging with typing indicators and timestamps
* 🔄 **Fallback System** - Local knowledge base backup if API is unavailable
* 🚀 **Production Ready** - Fully tested and deployed

## Quick Start

### Prerequisites
- Node.js installed
- API Key (Configure based on your AI service provider)

### Installation

```bash
cd JARVIS-2.0
npm install
```

### Configuration

1. Create a `.env` file in the project root:

```env
API_KEY=your_api_key_here
API_URL=your_api_endpoint_url
API_MODEL=your_model_name
PORT=8080
```

2. Get your API key from your AI service provider and configure it

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
- **AI**: Advanced AI Language Models
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

- Requires active internet connection for AI API
- Rate limited based on API provider's tier
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
