import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mic, Send, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

// Chat message bubble component
const AIMessage = ({ content, role, sources = [], isStreaming = false }) => {
  return (
    <div className={`flex w-full mb-6 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
        role === 'user' 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-card border border-border shadow-sm rounded-tl-sm'
      }`}>
        <div className={`text-[15px] leading-relaxed ${role === 'user' ? 'text-primary-foreground' : 'text-foreground'}`}>
          {content}
          {isStreaming && (
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
            />
          )}
        </div>
        
        {/* Source Pills rendering */}
        {sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center w-full mb-1">
              <BookOpen className="w-3 h-3 mr-1" /> Sources:
            </span>
            {sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.url} 
                className="inline-flex items-center text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md hover:bg-muted/80 transition-colors"
              >
                {source.title} <ChevronRight className="w-3 h-3 ml-1" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AICopilot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Hi there! I am your LendWise Copilot. I\'ve analyzed your loan portfolio. Did you know making one extra EMI payment a year could save you ₹45,000 in interest?',
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const shouldReduceMotion = useReducedMotion();
  const language = useAuthStore(state => state.language);
  const simpleMode = useAuthStore(state => state.simpleMode);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  // Voice Input Implementation using Web Speech API
  const handleMicrophoneClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US'; // Basic mapping, expand for 8 languages
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Streaming API Response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: '', isStreaming: true }]);
      
      const responseText = simpleMode 
        ? "That's a great question! If you put extra money towards your loan amount every month, you borrow less money overall, so you pay less cost."
        : "Excellent strategy. Making prepayments directly reduces your principal outstanding. Because interest is calculated on the remaining principal, this dramatically decreases your total interest burden and shortens your loan tenure.";
      
      let i = 0;
      const intervalId = setInterval(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          lastMsg.content += responseText.charAt(i);
          if (i >= responseText.length - 1) {
            lastMsg.isStreaming = false;
            lastMsg.sources = [{ title: 'Prepayment Strategies', url: '#' }];
            clearInterval(intervalId);
            setIsTyping(false);
          }
          return newMessages;
        });
        i++;
      }, 30);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="bg-muted/30 border-b border-border p-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LendWise Copilot
          </h2>
          <p className="text-xs text-muted-foreground mt-1">AI Financial Assistant</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6" aria-live="polite">
        {messages.map((msg, idx) => (
          <AIMessage key={idx} {...msg} />
        ))}
        {isTyping && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Copilot is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        {/* Quick Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
          {["How can I reduce my EMI?", "Explain my loan summary", "What is compounding?"].map((chip, idx) => (
            <button 
              key={idx} 
              onClick={() => setInput(chip)}
              className="whitespace-nowrap text-xs px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full border border-border/50 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 relative">
          <div className="flex-1 bg-background border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your debt..."
              className="w-full max-h-32 min-h-[52px] bg-transparent resize-none p-3 focus:outline-none text-foreground placeholder:text-muted-foreground"
              rows={1}
            />
            {/* Voice Waveform Animation Overlay */}
            {isListening && (
              <div className="absolute right-14 flex items-center gap-1 h-full px-4 text-primary bg-background/90 backdrop-blur-sm">
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-primary rounded-full" />
                <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full" />
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-primary rounded-full" />
              </div>
            )}
            <button 
              onClick={handleMicrophoneClick}
              className={`p-3 mr-1 rounded-lg transition-colors ${isListening ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Voice processed by your browser — LendWise never stores audio.
        </p>
      </div>
    </div>
  );
};

export default AICopilot;
