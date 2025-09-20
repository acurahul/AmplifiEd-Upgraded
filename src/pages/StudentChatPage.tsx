import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ThumbsUp, ThumbsDown, MessageSquare, Sparkles } from 'lucide-react';
import PortalHeader from '../components/PortalHeader';
import RoleGate from '../components/RoleGate';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Array<{
    chunk_id: string;
    score: number;
  }>;
}

export default function StudentChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI study assistant. I can help you understand concepts from your class materials, answer questions, and provide explanations. What would you like to learn about?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputMessage,
          session_id: sessionId
        })
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        citations: data.citations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = async (messageId: string, isPositive: boolean) => {
    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          is_positive: isPositive
        })
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const suggestedQuestions = [
    "What are the main types of chemical reactions?",
    "Can you explain acids and bases?",
    "How do I balance chemical equations?",
    "What's the difference between metals and non-metals?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <PortalHeader />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <RoleGate allowedRoles={['student']}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/student/home')}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
              Back to Dashboard
            </button>
            
            <div className="flex items-center space-x-2">
              <Sparkles className="text-teal-400" size={20} />
              <h1 className="text-xl font-semibold text-white">AI Study Assistant</h1>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                          : 'bg-slate-800/50 text-gray-300 border border-slate-700/50'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-600/50">
                          <p className="text-xs text-gray-400 mb-2">Sources:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.citations.map((citation, index) => (
                              <span
                                key={citation.chunk_id}
                                className="text-xs bg-slate-700/50 px-2 py-1 rounded-full"
                              >
                                Source {index + 1} ({(citation.score * 100).toFixed(0)}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-2 ml-2">
                        <button
                          onClick={() => handleFeedback(message.id, true)}
                          className="text-gray-500 hover:text-green-400 transition-colors"
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, false)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <ThumbsDown size={14} />
                        </button>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-400 mb-3">Try asking:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-left p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-violet-500/30 transition-colors text-sm text-gray-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-6 border-t border-slate-700/50">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your course materials..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </RoleGate>
      </main>
    </div>
  );
}