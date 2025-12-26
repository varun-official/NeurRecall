import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ENDPOINTS } from '../config';
import { StrategySelector } from './StrategySelector';
import ReactMarkdown from 'react-markdown';

export const ChatInterface = ({ userEmail = "varun@example.com" }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! Ask me anything about your documents.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [strategy, setStrategy] = useState('vector');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const query = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: query }]);
        setIsLoading(true);

        try {
            const res = await axios.post(ENDPOINTS.CHAT, {
                query,
                user_email: userEmail,
                rag_strategy: strategy
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.answer,
                sources: res.data.sources
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950/50">

            {/* Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-semibold text-white">Ask AI</h2>
                    <p className="text-xs text-slate-500">Powered by Gemini 2.5 & Voyage AI</p>
                </div>
                {/* We can put toolbar items here */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={`space-y-2 max-w-3xl ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                            <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                                }`}>
                                <div className="prose prose-invert prose-sm">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Sources */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="grid gap-2 w-full mt-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sources</p>
                                    {msg.sources.map((source, sIdx) => (
                                        <div key={sIdx} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg text-sm group hover:border-indigo-500/30 transition-colors">
                                            <div className="flex items-center gap-2 mb-1 text-slate-400">
                                                <FileText className="w-3 h-3 text-indigo-400" />
                                                <span className="text-xs truncate">{source.metadata.source || "Document"}</span>
                                                <span className="text-xs ml-auto bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{(source.score * 100).toFixed(0)}% Match</span>
                                            </div>
                                            <p className="text-slate-300 line-clamp-2 text-xs opacity-80">{source.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
                    <div className="absolute left-3 top-3">
                        <StrategySelector value={strategy} onChange={setStrategy} />
                    </div>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full pl-44 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-200 placeholder:text-slate-600"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <p className="text-center text-xs text-slate-600 mt-2">
                    AI can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
};
