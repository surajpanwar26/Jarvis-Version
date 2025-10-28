# JARVIS 2.0 - AI Chatbot

**JARVIS 2.0** is an intelligent AI-powered chatbot built with **C++** backend and React frontend, powered by the Groq AI language model. It features a dark-themed, interactive web interface with real-time AI responses.

## Features

* 🧠 **AI Integration** - Powered by Groq (llama-3.3-70b-versatile)
* ⚡ **Lightning Fast** - C++ backend for optimal performance
* 🎨 **Modern Dark Theme** - Beautiful cyberpunk-inspired UI with animations
* 💬 **Interactive Chat** - Real-time messaging with typing indicators
* 🔄 **Fallback System** - Local knowledge base backup if API is unavailable
* 🚀 **Production Ready** - Fully tested and deployed
* 📦 **Low Memory Footprint** - Efficient C++ server

## Quick Start

### Prerequisites
- **Frontend**: Node.js installed (for React dev server)
- **Backend**: Visual Studio 2019+, CMake, vcpkg, C++17
- **API Key**: Groq API key (free at https://console.groq.com)

### Frontend Installation

```bash
cd jarvis-react
npm install
npm run dev
```

This starts the React frontend on `http://localhost:3000`

### Backend Installation

See [CPP_SETUP_GUIDE.md](./CPP_SETUP_GUIDE.md) for detailed C++ backend setup.

Quick build:
```bash
.\build_cpp.bat
.\build\bin\Release\jarvis_server.exe
```

This starts the C++ server on `http://localhost:8080`

### Configuration

1. Create a `.env` file in the project root:

```env
API_KEY=your_groq_api_key_here
API_URL=https://api.groq.com/openai/v1/chat/completions
API_MODEL=llama-3.3-70b-versatile
```

2. Get your free Groq API key from https://console.groq.com

## Project Structure

```
JARVIS-2.0/
├── jarvis-react/           # React frontend (Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server.cpp              # C++ backend server
├── CMakeLists.txt          # Build configuration
├── build_cpp.bat           # Build script
├── CPP_SETUP_GUIDE.md      # C++ setup instructions
├── server_backup_nodejs.js # Backup of original Node.js server
├── .env                    # Environment variables
└── .gitignore              # Git configuration
```

## API Endpoints

- `POST /start` - Start the chatbot
- `POST /chat` - Send message to chatbot
- `POST /stop` - Stop the chatbot
- `GET /health` - Health check

## Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Three.js** - 3D graphics
- **CSS3** - Styling

### Backend (C++)
- **C++17** - Programming language
- **CMake** - Build system
- **libcurl** - HTTP client
- **jsoncpp** - JSON parsing
- **Winsock2** - Windows socket API

### AI Service
- **Groq** - LLM provider
- **llama-3.3-70b-versatile** - Default model


## Performance Comparison

| Metric | Node.js | C++ |
|--------|---------|-----|
| Startup | ~200ms | ~50ms |
| Memory | 60-80MB | 10-15MB |
| Throughput | Good | Excellent |
| Development | Fast | Slower (compilation) |

## Compilation Requirements

For detailed C++ setup, see [CPP_SETUP_GUIDE.md](./CPP_SETUP_GUIDE.md)

Required software:
- Visual Studio 2019 or later (Community Edition free)
- CMake 3.10+
- vcpkg package manager

### Automated Build (Windows)

```batch
:: Set vcpkg path
set VCPKG_PATH=C:\path\to\vcpkg

:: Run build script
build_cpp.bat

:: Run server
build\bin\Release\jarvis_server.exe
```

## Known Limitations

- Requires active internet connection for AI API
- Rate limited based on Groq API tier
- No conversation persistence (in-memory)
- Windows-specific for now (Winsock2 implementation)

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
