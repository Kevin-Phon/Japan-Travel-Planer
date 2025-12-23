import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Send } from 'lucide-react';
import { marked } from 'marked';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getGeminiResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('ai-chat-history', [
    { role: 'ai', text: "Konnichiwa! 🇯🇵 I'm your AI guide for Kyoto & Fukuoka. Ask me about food, culture, or translations!" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sumimasen! I'm having trouble connecting to the spirit world (API error). Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fillAndSend = (text: string) => {
    setInput(text);
    // Optional: Auto-send could be implemented here, but putting it in input is safer for user review
  };

  // Helper to safely render markdown
  const renderMarkdown = (text: string) => {
    return { __html: marked.parse(text) };
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold transition-transform hover:scale-110 hover:rotate-[-5deg] ${isOpen ? 'hidden' : 'block'}`}
      >
        <Sparkles className="w-6 h-6" />
        <span className="hidden md:inline pr-2">AI Guide</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
            <div className="bg-gradient-to-r from-red-700 to-pink-700 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg leading-tight">Travel Concierge ✨</h3>
                  <p className="text-xs opacity-80">Powered by Gemini AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] padding-3 px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                        ? 'bg-[#b91c1c] text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                  >
                    {msg.role === 'ai' ? (
                      <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />

              {/* Quick Prompts for initial state */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <button onClick={() => fillAndSend('How do I say thank you in Japanese?')} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition">🗣️ Translation</button>
                  <button onClick={() => fillAndSend('What is the etiquette for Onsen?')} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition">♨️ Etiquette</button>
                  <button onClick={() => fillAndSend('Recommend a lunch spot in Gion')} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition">🍜 Food Recs</button>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about food, culture, or translation..."
                  className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
