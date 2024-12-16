import { useEffect, useState } from "react";


function ChatBot() {
    const [inputValue, setInputValue] = useState('');
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const savedConversation = JSON.parse(localStorage.getItem('conversation')) || [];
        setConversation(savedConversation);
      }, []);

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!inputValue.trim()) return; // Không cho phép input rỗng
    
        try {
          // Gửi request tới API
          const response = await fetch('http://127.0.0.1:8000/generate-response', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: inputValue }),
          });
    
          const data = await response.json();
    
          // Cập nhật state với câu hỏi và câu trả lời
          const updatedConversation = [
            ...conversation,
            { type: 'question', text: inputValue },
            { type: 'response', text: data.response },
          ];
          
          setConversation(updatedConversation);
    
          // Lưu hội thoại vào localStorage
          localStorage.setItem('conversation', JSON.stringify(updatedConversation));
    
          // Xóa input sau khi gửi
          setInputValue('');
        } catch (error) {
          console.error('Error:', error);
        }
      };


    return ( <>
    <div className="form-container">
        <div className="chat-log">
                {conversation.map((entry, index) => (
                <div
                key={index}
                className={entry.type === 'question' ? 'chat-message' : 'chatbot-message'}
                >
                {entry.type === 'answer' && <div className="bot-name">Chatbot</div>}
                <div className={entry.type === 'question' ? 'message' : 'bot-message'}>
                    {entry.text}
                </div>
                </div>
            ))}
        </div>
        <div className="chat-input-holder">
            <form onSubmit={handleSubmit}>
                <textarea className="chat-input-textarea"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
    </> );
}

export default ChatBot;