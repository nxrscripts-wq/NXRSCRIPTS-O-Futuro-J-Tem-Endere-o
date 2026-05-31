import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';

type Role = 'user' | 'model';

interface ChatMessage {
  role: Role;
  text: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'model',
  text: 'Olá! Sou o assistente da NXRSCRIPTS. Posso ajudar com informações sobre cibersegurança, desenvolvimento de software ou consultoria IT. Como posso ajudar?',
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('nxr_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
          setHasUnread(false);
        }
      } catch {
        setMessages([INITIAL_MESSAGE]);
      }
    } else {
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  // Save to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('nxr_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input.trim() };
    const newHistory = [...messages, userMsg];

    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      // Limit to last 10 messages for context
      const contextHistory = messages.slice(-10);

      const reply = await sendChatMessage(userMsg.text, contextHistory);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'Desculpa, ocorreu um erro. Tenta novamente.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar assistente virtual' : 'Abrir assistente virtual'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && hasUnread && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-950 rounded-full" />
        )}
      </button>

      {/* Widget Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed bottom-24 right-6 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-cyan-500/10 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center">
              <span className="relative flex h-2.5 w-2.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <div>
                <h3 className="font-orbitron text-sm text-white tracking-wider">NXR Assistant</h3>
                <p className="text-[10px] text-slate-400 font-mono">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 max-h-72 overflow-y-auto bg-slate-900/50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-900 text-white rounded-tl-2xl rounded-tr-sm rounded-b-2xl'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tr-2xl rounded-tl-sm rounded-b-2xl'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-tr-2xl rounded-tl-sm rounded-b-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span
                      className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Escreve uma mensagem..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-lg bg-cyan-900/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-950 py-1.5 text-center border-t border-slate-800/50">
            <p className="text-[10px] text-slate-600 font-mono">Powered by NXRSCRIPTS · Gemini</p>
          </div>
        </div>
      )}
    </>
  );
};
