import { useEffect, useState } from "react";
import axios from 'axios';

function ChatBot() {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);

  // Load saved conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = JSON.parse(localStorage.getItem('conversation')) || [];
    setConversation(savedConversation);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue.trim()) return; // Prevent submitting empty input

    try {
      // Send question to the API using axios
      const response = await axios.post('http://localhost:8000/generate-response', {
        question: inputValue,
      });

      const data = response.data; // Axios returns the response data directly

      // Update the conversation with the question and the response
      const updatedConversation = [
        ...conversation,
        { type: 'question', text: inputValue },
        { type: 'response', text: data.response }, // Use response from API
      ];

      setConversation(updatedConversation);

      // Save updated conversation in localStorage
      localStorage.setItem('conversation', JSON.stringify(updatedConversation));

      // Clear input field after submit
      setInputValue('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="form-container">
        <h1>Trò chuyện với chatbot thư viện</h1>
        <div className="chat-log">
          {conversation.map((entry, index) => (
            <div
              key={index}
              className={entry.type === 'question' ? 'chat-message' : 'chatbot-message'}
            >
              {entry.type === 'response' && <div className="bot-name">Chatbot</div>}
              <div className={entry.type === 'question' ? 'message' : 'bot-message'}>
                {entry.text}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <textarea
              className="chat-input-textarea"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
