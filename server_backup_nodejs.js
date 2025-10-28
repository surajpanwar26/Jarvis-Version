const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 8080;
const API_KEY = process.env.API_KEY || '';
const API_URL = process.env.API_URL || '';
const API_MODEL = process.env.API_MODEL || 'llama-3.3-70b-versatile';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let chatbotProcess = null;
let lastResponse = '';
let responseBuffer = '';
let responseTimeout = null;

const aiKnowledgeBase = {
    'machine learning': 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
    'python': 'Python is a high-level, interpreted programming language known for its simplicity and readability.',
    'artificial intelligence': 'Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems.',
    'cloud computing': 'Cloud Computing is the delivery of computing services over the internet.',
    'blockchain': 'Blockchain is a distributed ledger technology that maintains continuously growing list of records.',
    'internet': 'The Internet is a global system of interconnected computer networks using TCP/IP protocols.',
    'database': 'A Database is an organized collection of structured data stored and accessed electronically.',
    'api': 'An API (Application Programming Interface) is a set of protocols allowing different software to communicate.',
    'cybersecurity': 'Cybersecurity encompasses technologies and practices to protect computers and data from attacks.',
    'india': 'India is a South Asian country and the worlds most populous democracy with over 1.4 billion people.',
    'taj mahal': 'The Taj Mahal is an iconic ivory-white marble mausoleum in Agra, India built in the 17th century.',
    'paris': 'Paris is the capital and largest city of France known as the City of Light.',
    'london': 'London is the capital and largest city of the United Kingdom with a 2000-year history.',
    'tokyo': 'Tokyo is the capital of Japan and the worlds most populous metropolitan area.',
    'default': 'That is an interesting question! I can help with topics related to geography, technology, and science.'
};

function generateSmartResponse(userQuery) {
    const lowerQuery = userQuery.toLowerCase();
    const termsByLength = Object.keys(aiKnowledgeBase)
        .filter(key => key !== 'default')
        .sort((a, b) => b.length - a.length);
    
    for (const key of termsByLength) {
        if (lowerQuery.includes(key)) {
            return aiKnowledgeBase[key];
        }
    }
    
    return aiKnowledgeBase.default;
}

async function generateAIResponse(userQuery) {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: API_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are JARVIS 2.0, an intelligent and helpful AI assistant.'
                    },
                    {
                        role: 'user',
                        content: userQuery
                    }
                ],
                temperature: 0.7,
                max_tokens: 512
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                timeout: 15000
            }
        );
        
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        }
        return generateSmartResponse(userQuery);
    } catch (error) {
        console.error('Error generating AI response:', error.message);
        return generateSmartResponse(userQuery);
    }
}

app.post('/start', (req, res) => {
    const exePath = path.join(__dirname, 'src', 'chanakya.exe');
    
    if (!fs.existsSync(exePath)) {
        return res.status(404).json({ 
            status: 'error',
            message: 'Chatbot executable not found. Running in AI-only mode.',
            demo_mode: true
        });
    }
    
    try {
        chatbotProcess = spawn(exePath, [], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: false,
            windowsHide: true
        });
        
        setTimeout(() => {
            res.json({ 
                status: 'started',
                message: 'JARVIS 2.0 is ready with AI Knowledge Base!'
            });
        }, 1500);

    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

app.post('/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Message cannot be empty'
        });
    }
    
    generateAIResponse(message)
        .then(aiResponse => {
            res.json({ 
                response: aiResponse,
                status: 'success',
                source: 'AI Knowledge Base 🧠'
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        });
});

app.post('/stop', (req, res) => {
    if (chatbotProcess) {
        try {
            chatbotProcess.kill();
        } catch (err) {
            console.error('Error stopping chatbot:', err);
        }
        chatbotProcess = null;
    }
    res.json({ status: 'stopped', message: 'Chatbot stopped successfully' });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        ai_model: 'Groq llama-3.3-70b-versatile',
        timestamp: new Date().toISOString()
    });
});

process.on('SIGINT', () => {
    console.log('\nShutting down JARVIS 2.0 server...');
    if (chatbotProcess) {
        try {
            chatbotProcess.kill();
        } catch (err) {
            console.error('Error during shutdown:', err);
        }
    }
    process.exit(0);
});

app.listen(PORT, () => {
    console.log('\n✨ JARVIS 2.0 AI Expert System Server (Node.js Backup) ✨');
    console.log('🚀 Running on http://localhost:' + PORT);
    console.log('🧠 AI Engine: Groq API (llama-3.3-70b-versatile)');
    console.log('⚡ Lightning Fast Responses - Powered by Groq');
    console.log('🔧 Press Ctrl+C to stop the server\n');
});
