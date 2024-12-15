
function ChatBot() {

    return ( <>
    <div className="form-container">
        <div className="chat-log">
            <div className="chat-message">
                <div className="message">
                    message
                </div>
            </div>
            <div className="chat-message">
                <div className="message">
                    message
                </div>
            </div>
            <div className="chat-message">
                <div className="message">
                    message
                </div>
            </div>
            <div className="chatbot-message">
                <div className="bot-name">
                    chatbot
                </div>
                <div className="bot-message">
                    message
                </div>
            </div>
        </div>
        <div className="chat-input-holder">
            <form>
                <textarea className="chat-input-textarea"/>
            </form>
        </div>
    </div>
    </> );
}

export default ChatBot;