const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 8080;
const API_KEY = process.env.API_KEY || '';
if (!API_KEY) {
    console.warn('⚠️  Warning: API_KEY not set. Please configure it in .env file.');
}
const API_URL = process.env.API_URL || '';
const API_MODEL = process.env.API_MODEL || 'default-model';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let chatbotProcess = null;
let lastResponse = '';
let waitingForResponse = false;
let responseBuffer = '';
let responseTimeout = null;

// AI Knowledge Base - Kept as fallback only (if Groq API fails)
const aiKnowledgeBase = {
    'machine learning': 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make predictions. ML is widely used in recommendation systems, image recognition, natural language processing, fraud detection, and autonomous vehicles.',
    'python': 'Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python is widely used in web development, data analysis, artificial intelligence, scientific computing, automation, and DevOps. Popular libraries include NumPy, Pandas, TensorFlow, and Django.',
    'artificial intelligence': 'Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems. These processes include learning, reasoning, problem-solving, perception, and language understanding. AI applications range from chatbots and virtual assistants to autonomous vehicles, medical diagnostics, and game-playing algorithms.',
    'cloud computing': 'Cloud Computing is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet (\"the cloud\"). Major providers include AWS, Microsoft Azure, and Google Cloud Platform. Benefits include scalability, cost-efficiency, flexibility, disaster recovery, and reduced infrastructure management.',
    'blockchain': 'Blockchain is a distributed ledger technology that maintains a continuously growing list of records called blocks. Each block contains a cryptographic hash of the previous block, creating an immutable chain. It is the foundation of cryptocurrencies like Bitcoin and Ethereum, with applications in supply chain management, healthcare, voting systems, and smart contracts.',
    'internet': 'The Internet is a global system of interconnected computer networks that use standardized communication protocols (TCP/IP) to link devices worldwide. It enables instantaneous communication, information sharing, e-commerce, and access to services. Key technologies include DNS, HTTP/HTTPS, and routing protocols that ensure reliable data transmission.',
    'quantum computing': 'Quantum Computing leverages quantum mechanics principles to perform computations. Unlike classical computers using bits (0 or 1), quantum computers use quantum bits or qubits that can exist in superposition (both 0 and 1 simultaneously). This allows quantum computers to perform certain calculations exponentially faster. Applications include cryptography, optimization, drug discovery, and climate modeling.',
    'photosynthesis': 'Photosynthesis is the biological process in plants where sunlight, water, and carbon dioxide are converted into glucose (sugar) and oxygen. It occurs in two main stages: light-dependent reactions in the thylakoid membranes and light-independent reactions (Calvin cycle) in the stroma. Photosynthesis is essential for life on Earth as it produces oxygen and organic compounds that form the base of food chains.',
    'array': 'An Array is a fundamental data structure that stores a fixed-size sequential collection of elements of the same type. Elements are accessed by their index, usually starting from 0. Arrays provide efficient random access with O(1) time complexity but have fixed size in many programming languages. They are used extensively in algorithms, data manipulation, and memory management.',
    'database': 'A Database is an organized collection of structured data stored and accessed electronically. Databases use Database Management Systems (DBMS) to manage data efficiently. Types include relational databases (SQL-based), NoSQL databases, and graph databases. They support operations like Create, Read, Update, and Delete (CRUD) and are essential for modern applications.',
    'api': 'An API (Application Programming Interface) is a set of protocols and rules that allows different software applications to communicate with each other. APIs define the methods and formats that applications should use to request and exchange data. Types include REST APIs, GraphQL APIs, and WebSocket APIs. APIs enable integration between systems and are fundamental to modern software architecture.',
    'cybersecurity': 'Cybersecurity encompasses technologies, processes, and practices designed to protect computers, networks, and data from digital attacks. It includes authentication, encryption, firewalls, intrusion detection systems, and security protocols. Key areas include network security, application security, information security, and incident response.',
    'machine learning': 'Machine Learning is a subset of artificial intelligence enabling systems to learn from data without explicit programming. Algorithms identify patterns and make predictions improving over time. Applications include recommendation systems, image recognition, natural language processing, and predictive analytics.',
    'data science': 'Data Science is an interdisciplinary field combining statistics, computer science, and domain expertise to extract meaningful insights from data. Data scientists use programming, statistical analysis, machine learning, and visualization to solve complex problems. It involves data collection, cleaning, exploration, modeling, and communication of findings.',
    'capital of india': 'The capital of India is New Delhi. It was built in the 1930s as a planned city during the British Raj and became India\'s capital on January 26, 1950, after India gained independence. New Delhi serves as the political and administrative center of India, housing the Parliament of India, the President\'s residence, and the Prime Minister\'s office.',
    'new delhi': 'New Delhi is the capital and second-largest city of India. Located in northern India, it serves as the political and administrative center. New Delhi has a rich history and beautiful architecture including government buildings, India Gate, Rashtrapati Bhavan, and Parliament House. The city is known as the city of monuments.',
    'india': 'India is a South Asian country and the world\'s most populous democracy with over 1.4 billion people. It is the seventh-largest country by area. India gained independence from British rule on August 15, 1947. The capital is New Delhi. India is known for Bollywood, IT industry, diverse culture, religions, languages, and historical monuments like the Taj Mahal.',
    'taj mahal': 'The Taj Mahal is an iconic ivory-white marble mausoleum located in Agra, India. Built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal in the 17th century, it was completed in 1653. It is considered one of the most beautiful buildings in the world and a UNESCO World Heritage Site. The Taj Mahal represents the pinnacle of Mughal architecture.',
    'paris': 'Paris is the capital and largest city of France, located in north-central France on the Seine River. Known as "The City of Light," Paris is famous for its art, fashion, gastronomy, and architecture. Iconic landmarks include the Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and Arc de Triomphe. Paris is a major global center for art, culture, and commerce.',
    'london': 'London is the capital and largest city of the United Kingdom. Located on the Thames River, London has a history spanning over 2,000 years. Famous landmarks include Big Ben, Tower Bridge, Buckingham Palace, and the British Museum. London is one of the world\'s leading financial centers and known for its diverse culture and historic architecture.',
    'tokyo': 'Tokyo is the capital of Japan and the world\'s most populous metropolitan area. Located on Japan\'s eastern coast, Tokyo is the political, economic, and cultural center of Japan. It is known for blending ancient traditions with cutting-edge technology. Famous sites include historic temples, modern skyscrapers, and vibrant entertainment districts.',
    'united states': 'The United States of America is a federal republic consisting of 50 states. With over 330 million people, it is the third-most populous country and has the largest economy in the world. The capital is Washington, D.C. The USA is known for technological innovation, diverse culture, democratic system, and significant global influence.',
    'washington dc': 'Washington, D.C. is the capital city of the United States. Located on the Potomac River between Maryland and Virginia, it is the seat of the U.S. federal government. Famous landmarks include the White House, Capitol Building, Washington Monument, and Lincoln Memorial. The city is known for its neoclassical architecture.',
    'default': 'That\'s an interesting question! I can help with topics related to geography, world capitals, countries, landmarks, technology, programming, science, and general information. Please feel free to ask about world capitals, famous landmarks, or any technology topics and I\'ll provide detailed information.'
};

// Smart response generator
function generateSmartResponse(userQuery) {
    const lowerQuery = userQuery.toLowerCase();
    
    // Check for exact and partial matches - ordered by specificity
    // Check longer/more specific terms first
    const termsByLength = Object.keys(aiKnowledgeBase)
        .filter(key => key !== 'default')
        .sort((a, b) => b.length - a.length);
    
    for (const key of termsByLength) {
        // Check if the key appears as a complete term
        if (lowerQuery.includes(key)) {
            return aiKnowledgeBase[key];
        }
    }
    
    // Check for question patterns
    if (lowerQuery.startsWith('what is') || lowerQuery.includes('what is')) {
        const topic = userQuery.replace(/what is|What is/gi, '').trim();
        return `I can provide information about "${topic}". Based on my knowledge, this is an important topic. Please ask for specific details and I'll provide comprehensive information.`;
    }
    
    if (lowerQuery.startsWith('how') || lowerQuery.startsWith('explain')) {
        return 'I can explain various processes and mechanisms. Please specify what aspect you\'d like to understand and I\'ll provide a detailed explanation.';
    }
    
    if (lowerQuery.includes('?')) {
        return aiKnowledgeBase.default;
    }
    
    return aiKnowledgeBase.default;
}

// AI Response function - uses configured AI service
async function generateAIResponse(userQuery) {
    try {
        console.log('\n=== Generating AI Response ===');
        console.log('Query:', userQuery);
        
        const response = await axios.post(
            API_URL,
            {
                model: API_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are JARVIS 2.0, an intelligent and helpful AI assistant. Provide clear, concise, and accurate answers to user questions.'
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
            const aiResponse = response.data.choices[0].message.content;
            console.log('✓ Response generated successfully');
            console.log('Tokens used:', response.data.usage.total_tokens);
            console.log('=== Response Generation Complete ===\n');
            return aiResponse;
        } else {
            throw new Error('Unexpected API response format');
        }
    } catch (error) {
        console.error('Error generating AI response:', error.message);
        // Fallback to local knowledge base if API fails
        console.log('⚠️ Falling back to local knowledge base...');
        return generateSmartResponse(userQuery);
    }
}

// Start the chatbot
app.post('/start', (req, res) => {
    if (chatbotProcess) {
        console.log('Chatbot already running');
        return res.json({ 
            status: 'already_running',
            message: 'Chatbot is already active'
        });
    }

    const exePath = path.join(__dirname, 'src', 'chanakya.exe');
    
    if (!fs.existsSync(exePath)) {
        console.log('Chatbot executable not found at:', exePath);
        return res.status(404).json({ 
            status: 'error',
            message: 'Chatbot executable not found. Running in AI-only mode.',
            demo_mode: true
        });
    }
    
    console.log('Starting chatbot from:', exePath);
    
    try {
        chatbotProcess = spawn(exePath, [], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: false,
            windowsHide: true
        });
        
        chatbotProcess.stdout.setEncoding('utf8');
        chatbotProcess.stdin.setDefaultEncoding('utf8');

        chatbotProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('Bot output chunk:', JSON.stringify(output));
            
            responseBuffer += output;
            
            if (responseTimeout) clearTimeout(responseTimeout);
            
            const lines = responseBuffer.split('\n');
            
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                
                if (!line || line === '......') continue;
                
                const colonIndex = line.indexOf(':');
                if (colonIndex > -1) {
                    const prefix = line.substring(0, colonIndex).trim();
                    const response = line.substring(colonIndex + 1).trim();
                    
                    if (prefix && !prefix.includes('You') && response) {
                        lastResponse = response;
                        console.log('Captured valid response:', response);
                        
                        if (responseTimeout) clearTimeout(responseTimeout);
                        responseTimeout = setTimeout(() => {
                            console.log('Response finalized:', lastResponse);
                        }, 300);
                    }
                }
            }
            
            responseBuffer = lines[lines.length - 1];
        });

        chatbotProcess.stderr.on('data', (data) => {
            console.error('Chatbot stderr:', data.toString());
        });

        chatbotProcess.on('close', (code) => {
            console.log(`Chatbot process exited with code ${code}`);
            chatbotProcess = null;
        });

        setTimeout(() => {
            console.log('Chatbot started successfully');
            res.json({ 
                status: 'started',
                message: 'JARVIS 2.0 is ready with AI Knowledge Base!'
            });
        }, 1500);

    } catch (error) {
        console.error('Error starting chatbot:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// Send a message to the chatbot
app.post('/chat', (req, res) => {
    if (!chatbotProcess) {
        return res.status(400).json({
            status: 'error',
            message: 'Chatbot not started'
        });
    }

    const { message } = req.body;
    console.log('\n=== Chat Request ===');
    console.log('User message:', message);
    
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Message cannot be empty'
        });
    }
    
    lastResponse = '';
    responseBuffer = '';
    waitingForResponse = true;
    
    try {
        chatbotProcess.stdin.write(message + '\n');
        console.log('Message sent to chatbot process');
    } catch (err) {
        console.error('Error writing to chatbot stdin:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to send message to chatbot'
        });
    }
    
    const responseWaitTime = Math.max(1500, Math.min(3000, message.length * 20));
    
    const timeoutHandle = setTimeout(() => {
        waitingForResponse = false;
        
        let response = lastResponse;
        
        if (!response || response.length === 0) {
            console.log('No knowledge base match - using AI Knowledge Base...');
            
            generateAIResponse(message)
                .then(aiResponse => {
                    console.log('AI response generated:', aiResponse.substring(0, 80));
                    console.log('=== Chat Request Complete ===\n');
                    res.json({ 
                        response: aiResponse,
                        status: 'ai_research',
                        source: 'AI Knowledge Base 🧠'
                    });
                })
                .catch(err => {
                    console.error('AI generation error:', err.message);
                    const fallbackResponse = 'I couldn\'t find this information in my knowledge base. Please try asking about technology, programming, science, or other general topics.';
                    res.json({ 
                        response: fallbackResponse,
                        status: 'no_match',
                        error: err.message
                    });
                });
        } else {
            console.log('Response found in knowledge base');
            console.log('=== Chat Request Complete ===\n');
            res.json({ 
                response,
                status: 'success',
                source: 'Knowledge Base 📚'
            });
        }
    }, responseWaitTime);
});

// Stop the chatbot
app.post('/stop', (req, res) => {
    console.log('Stop request received');
    if (chatbotProcess) {
        try {
            chatbotProcess.stdin.write('bye\n');
            setTimeout(() => {
                if (chatbotProcess) {
                    try {
                        chatbotProcess.kill();
                    } catch (err) {
                        console.error('Error killing process:', err);
                    }
                }
            }, 500);
        } catch (err) {
            console.error('Error stopping chatbot:', err);
        }
        chatbotProcess = null;
        lastResponse = '';
        responseBuffer = '';
    }
    res.json({ status: 'stopped', message: 'Chatbot stopped successfully' });
});

// Direct AI query endpoint
app.post('/ai-research', (req, res) => {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Message cannot be empty'
        });
    }
    
    console.log('Direct AI research query:', message);
    
    generateAIResponse(message)
        .then(aiResponse => {
            res.json({
                response: aiResponse,
                status: 'success',
                source: 'AI Knowledge Base'
            });
        })
        .catch(err => {
            console.error('AI research error:', err);
            res.status(500).json({
                status: 'error',
                message: err.message,
                source: 'AI Knowledge Base'
            });
        });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        chatbot_running: chatbotProcess !== null,
        ai_service: AI_SERVICE,
        ai_model: 'Groq llama-3.3-70b-versatile',
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down JARVIS 2.0 server...');
    console.log('🧠 AI Knowledge Base module going offline');
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
    console.log('\n✨ JARVIS 2.0 AI Expert System Server ✨');
    console.log('🚀 Running on http://localhost:' + PORT);
    console.log('📱 Open http://localhost:' + PORT + '/index.html in your browser');
    console.log('🧠 AI Engine: Groq API (llama-3.3-70b-versatile)');
    console.log('⚡ Lightning Fast Responses - Powered by Groq');
    console.log('🔧 Press Ctrl+C to stop the server\n');
});
