import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Message } from '@/types';

/**
 * Interactive chatbot interface showing conversation logs, sending messages,
 * and receiving backend/IPC skeleton responses.
 */
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: "Hello! I am Luna, your desktop assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on conversation updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (): void => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Trigger mock AI IPC handler response from main process
    setTimeout(() => {
      if (window.electronAPI) {
        window.electronAPI
          .invoke('ai:query', { prompt: input })
          .then((res) => {
            const aiMsg: Message = {
              id: Math.random().toString(),
              sender: 'assistant',
              content: res.response,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
          })
          .catch((err) => {
            console.error('Failed to query AI:', err);
          });
      }
    }, 700);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-h-full">
      {/* Messages Feed Viewport */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[70%] p-4 rounded-2xl border text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-accent text-white border-accent/25 rounded-tr-none'
                    : 'bg-surface text-text-primary border-border rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span className="text-[9px] block text-right mt-1 opacity-70 font-semibold uppercase tracking-wider">
                  {msg.timestamp}
                </span>
              </div>
              {isUser && (
                <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Message input prompt panel */}
      <div className="flex items-center space-x-2 bg-surface border border-border p-2 rounded-xl shadow-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message or ask Luna..."
          className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none px-3 py-2 placeholder-text-secondary"
        />
        <button
          onClick={handleSend}
          className="p-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer shadow-sm hover:shadow flex items-center justify-center"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
