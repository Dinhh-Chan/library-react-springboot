import { useEffect, useRef, useState } from "react";
import axios from 'axios';

function ChatBot() {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [predefinedQuestions] = useState([
    { question: "Địa chỉ của thư viện ở đâu?", answer: "122 Hoàng Quốc ViệtCổ Nhuế, Cầu Giấy, Hà Nội" },
    { question: "Tôi phải làm gì nếu bị mất sách của thư viện?", answer: "Bạn hãy vào phần báo cáo với quản trị viên, sau đó nhập tiêu đề kèm theo nội dung tương ứng để có thể nhận được tư vấn của quản trị viên nhé" },
    { question: "Thư viện mở cửa trong khoảng thời gian nào?", answer: "Thư viện mở cửa vào 8-12h sáng và 13-17h chiều nhé" }
  ]);

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

  // Handle predefined question selection
  const handlePredefinedQuestion = (question) => {
    setInputValue(question);

    // Find the answer for the selected question
    const selectedQuestion = predefinedQuestions.find(q => q.question === question);
    
    if (selectedQuestion) {
      // If the selected question has a predefined answer, automatically show it in the conversation
      const updatedConversation = [
        ...conversation,
        { type: 'question', text: selectedQuestion.question },
        { type: 'response', text: selectedQuestion.answer }, // Use predefined answer
      ];

      setConversation(updatedConversation);
      // Save updated conversation in localStorage
      localStorage.setItem('conversation', JSON.stringify(updatedConversation));
    }
  };

  const chatLogRef = useRef(null);

  // Cuộn xuống cuối khi tin nhắn thay đổi
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <>
      <div className="form-container">
        <h1>Trò chuyện với chatbot thư viện</h1>
        <div className="chat-log" ref={chatLogRef}>
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

        {/* Predefined questions */}
        <div className="predefined-questions">
          <h3>Câu hỏi thường gặp</h3>
          {predefinedQuestions.map((item, index) => (
            <button 
              key={index} 
              onClick={() => handlePredefinedQuestion(item.question)}
              className="predefined-question-button"
            >
              {item.question}
            </button>
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
