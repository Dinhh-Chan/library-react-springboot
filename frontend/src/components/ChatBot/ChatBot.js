import React, { useState } from 'react';
import { fetchChatGPTResponse } from './openaiService';  // Import service
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleSendMessage = async () => {
        if (!userMessage) return;

        // Thêm tin nhắn của người dùng vào giao diện
        setMessages([...messages, { role: 'user', content: userMessage }]);
        setUserMessage('');

        try {
            // Gọi API ChatGPT và nhận phản hồi
            const response = await fetchChatGPTResponse(userMessage);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', content: response },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className={`chatbot-container ${isChatOpen ? 'open' : ''}`}>
            <button
                className="chatbot-toggle"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                {isChatOpen ? 'Đóng Chatbot' : 'Mở Chatbot'}
            </button>

            {isChatOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.role}>
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Hỏi tôi điều gì!"
                    />
                    <button onClick={handleSendMessage}>Gửi</button>
                </div>
            )}
        </div>
    );
};

export default ChatBot;