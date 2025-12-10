import React, { useRef, useEffect } from 'react';
import { Message, Sender } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F2]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#EDEDED] border-b border-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Cyber Diplomat</h2>
            <p className="text-xs text-green-600">● Online</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => {
          const isUser = msg.sender === Sender.User;
          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {isUser ? (
                     <div className="w-10 h-10 rounded bg-gray-300 overflow-hidden">
                        <img src="https://picsum.photos/seed/user/40/40" alt="User" className="w-full h-full object-cover" />
                     </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">
                      D
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`relative px-4 py-2 rounded-lg text-sm leading-relaxed shadow-sm
                    ${isUser 
                        ? 'bg-[#95EC69] text-black rounded-tr-none' // WhatsApp/WeChat Green
                        : 'bg-white text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {msg.mediaUrl && (
                      <div className="mb-2 rounded overflow-hidden">
                        {msg.mediaType === 'image' ? (
                          <img src={msg.mediaUrl} alt="Generated Content" className="max-w-full h-auto rounded" />
                        ) : (
                          <video src={msg.mediaUrl} controls autoPlay loop className="max-w-full h-auto rounded" />
                        )}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 mx-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
           <div className="flex w-full justify-start">
              <div className="flex flex-row gap-2 max-w-[85%]">
                 <div className="w-10 h-10 rounded bg-indigo-600 flex items-center justify-center text-white font-bold animate-pulse">
                    D
                 </div>
                 <div className="bg-white px-4 py-2 rounded-lg rounded-tl-none shadow-sm flex items-center">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                 </div>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#F7F7F7] px-4 py-3 border-t border-gray-300">
        <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1 border border-gray-200 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-transparent transition-all">
          <input
            type="text"
            className="flex-1 px-2 py-2 text-sm bg-transparent outline-none text-gray-800"
            placeholder="Talk to the Cyber Diplomat..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-colors ${inputText.trim() ? 'bg-[#95EC69] text-white hover:bg-[#85d65d]' : 'bg-gray-200 text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};