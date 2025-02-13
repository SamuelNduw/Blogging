import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const Testing = () => {
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!userInput.trim()) return;

        const userMessage = { text: userInput, sender: 'user'};
        setChatMessages((prevMessages) => [...prevMessages, userMessage]);
        setUserInput('')

        const botMessage = { text:'...', sender: 'bot'}
        setChatMessages((prevMessages) => [...prevMessages, botMessage]);

        try{
            const response = await fetch('http://localhost:8001/hospital/chatbot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ message: userInput }),
            });
            
            const reader = response.body.getReader();
            let output = '';

            while(true) {
                const { done, value } = await reader.read();
                if (done) break;
                output += new TextDecoder().decode(value);
                setChatMessages((prevMessages) => 
                    prevMessages.map((msg, index) =>
                        index === prevMessages.length - 1
                            ? {...msg, text: output }
                            : msg
                        )
                    );
            }
        } catch (error){
            console.error('Error fetching bot response:', error);
        }
    };

  return (
    <div className="w-full h-[90vh]">
        <div className=' w-full' id="chat-box">
            {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message-${msg.sender} prose`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} >
                        {msg.text}
                    </ReactMarkdown>
                </div>
            ))}
        </div>
        <form 
            onSubmit={handleSubmit}
            className="w-full flex justify-center absolute bottom-0 pb-5"
        >
            <div className="bg-slate-200 rounded-md w-1/2 flex flex-col justify-center px-4 py-2">
                <input 
                    type="text"
                    id="user-message"
                    placeholder="Type your message her..."
                    value={userInput} 
                    onChange={(e) => setUserInput(e.target.value)}
                    required
                    className="bg-slate-200 rounded-md p-5 focus:outline-none focus:ring-0"
                />
                <div className="w-full flex justify-end">
                    <button 
                        type="submit" 
                        id="chat-submit"
                        className="px-4 py-2 bg-indigo-500 rounded-md text-white"
                    >
                        Send
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default Testing;
