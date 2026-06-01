import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X, Send } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { COMPANY_INFO } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const WELCOME_MESSAGE =
  'Olá! Sou o NXR Assistant da NXRSCRIPTS. Posso ajudar com informações sobre os nossos serviços de TI, cibersegurança, desenvolvimento de software ou consultoria tecnológica. Como posso ajudar?';

const QUICK_REPLIES = ['Que serviços oferecem?', 'Como contratar?', 'Soluções para empresas?'];

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('nxr_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
        setHasWelcomed(true);
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('nxr_chat', JSON.stringify(messages));
      } catch {
        // Ignore storage error
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setHasUnread(false);
      setIsTyping(true);
      setTimeout(() => {
        addAssistantMessage(WELCOME_MESSAGE);
        setHasWelcomed(true);
        setIsTyping(false);
      }, 800);
    }
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasWelcomed]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const addAssistantMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;
    setInput('');

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: msg,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const history = messages.slice(-8).map(m => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));
      const reply = await sendChatMessage(msg, history);
      addAssistantMessage(reply);
    } catch {
      addAssistantMessage(
        `Desculpa não estamos disponiveis. Podes contactar-nos directamente:\n📧 ${COMPANY_INFO.contact.email}\n📱 ${COMPANY_INFO.contact.whatsapp}`
      );
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  const Widget = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 font-sans"
    >
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center mr-3 relative">
            <span className="text-cyan-400 font-mono text-sm font-bold">N</span>
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">NXR Assistant</h3>
            <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded"
          aria-label="Fechar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 max-h-[60vh] sm:max-h-80 overflow-y-auto bg-slate-900 flex flex-col gap-4">
        {messages.length === 0 && !isTyping && (
          <div className="text-center text-slate-500 text-sm my-auto font-mono">
            A carregar assistente...
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded bg-slate-800 border border-cyan-500/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-[10px] text-cyan-400 font-mono font-bold">N</span>
              </div>
            )}
            <div
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}
            >
              <div
                className={`px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tl-2xl rounded-tr-sm rounded-b-2xl'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tr-2xl rounded-tl-sm rounded-b-2xl'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded bg-slate-800 border border-cyan-500/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">N</span>
            </div>
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

        {messages.length === 1 && messages[0].role === 'assistant' && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-2 ml-8">
            {QUICK_REPLIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 text-[11px] bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:text-cyan-300 text-slate-400 rounded-full transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Escreve a tua pergunta..."
            maxLength={500}
            disabled={isTyping}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Enviar mensagem"
            className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-950 py-2 px-4 border-t border-slate-800/50 flex justify-between items-center">
        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
          NXRSCRIPTS · Luanda, Angola
        </span>
        <a
          href="https://wa.me/244923479049"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-[10px] text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={
          isOpen ? 'Fechar assistente virtual' : 'Abrir assistente virtual — NXR Assistant'
        }
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200 text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
            1
          </span>
        )}
      </button>

      {isOpen && createPortal(Widget, document.body)}
    </>
  );
};

export default Chatbot;
