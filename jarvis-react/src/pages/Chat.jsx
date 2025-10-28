import { useState, useRef, useEffect } from 'react'
import './Chat.css'
import Header from '../components/Header'

function Chat({ onNavigate }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am JARVIS 2.0. How can I help you today?', sender: 'bot' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputValue })
      })

      const data = await response.json()

      const botMessage = {
        id: messages.length + 2,
        text: data.response || 'Sorry, I could not generate a response.',
        sender: 'bot'
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please make sure the backend server is running on port 8080.',
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <Header onNavigate={onNavigate} />
      
      <div className="chat-main">
        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
