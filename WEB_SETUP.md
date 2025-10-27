# JARVIS 2.0 Web Interface Setup

## Quick Start

### Prerequisites

1. **Node.js** installed (https://nodejs.org/)
2. **Groq API Key** (free from https://console.groq.com/)

### Installation & Setup

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Configure API Key**
   - Create `.env` file in project root
   - Add: `GROQ_API_KEY=your_groq_api_key_here`

3. **Start the server**
   ```powershell
   node server.js
   ```

4. **Open in browser**
   - Navigate to: http://localhost:8080
   - Click "Start Chatbot"
   - Start chatting with JARVIS 2.0!

## Features

✨ **Interactive Chat Interface**
- Real-time messaging with JARVIS 2.0
- Cyberpunk dark theme design
- Animated particles and effects
- Smooth transitions and hover effects

⚡ **Groq AI Integration**
- Powered by Llama-3.3-70b-versatile
- Lightning-fast responses
- Intelligent conversation
- Fallback knowledge base

🎨 **UI Elements**
- Message history display
- Input field with send button
- Start/Stop controls
- Connection status display
- Typing indicators

## Troubleshooting

**If Groq API doesn't connect:**
- Verify API key in `.env` file
- Check internet connection
- Ensure API key has proper permissions
- Fallback local knowledge base will still work

**To customize:**
- Edit `index.html` for frontend changes
- Edit `server.js` for backend logic
- Update `.env` for API configuration

## Environment Variables

```env
GROQ_API_KEY=your_key_here
PORT=8080
```

## Support

For issues visit: https://github.com/surajpanwar26/JARVIS-2.0
