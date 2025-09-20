import React, { useState } from 'react';
import { ArrowLeft, Send, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import RoleGate from '../components/RoleGate';
import Section from '../components/Section';

export default function StudentChatPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI study assistant. I can help you understand concepts from your class materials. What would you like to learn about?",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "That's a great question! Based on your class materials, chemical reactions involve the formation of new substances with different properties. There are four main types: combination, decomposition, displacement, and double displacement reactions.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <RoleGate allowedRoles={['student']}>
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

          <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                      : 'bg-slate-800/50 text-gray-300 border border-slate-700/50'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-700/50">
              <div className="flex space-x-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question about your course materials..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center"
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