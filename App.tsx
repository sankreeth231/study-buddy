import React, { useState, useRef, useEffect } from 'react';
import { Chat } from "@google/genai";
import { createChatSession, sendMessageStream } from './services/geminiService';
import { Message, Role, Subject } from './types';
import { SUBJECTS, INITIAL_SYSTEM_INSTRUCTION } from './constants';
import MessageBubble from './components/MessageBubble';
import SubjectSelector from './components/SubjectSelector';

// SVG Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hi! I'm StudyBuddy. 👋 \nI can help you with definitions, solve math problems step-by-step, or explain complex topics simply.\n\nPick a subject above or just ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.GENERAL);
  
  // Refs
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Chat
  useEffect(() => {
    initChat(currentSubject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initChat = (subjectId: Subject) => {
    const subjectConfig = SUBJECTS.find(s => s.id === subjectId);
    const fullSystemPrompt = `${INITIAL_SYSTEM_INSTRUCTION}\n\nCURRENT CONTEXT: ${subjectConfig?.systemPromptAddon || ''}`;
    chatSessionRef.current = createChatSession(fullSystemPrompt);
  };

  const handleSubjectChange = (subject: Subject) => {
    if (subject === currentSubject) return;
    setCurrentSubject(subject);
    
    // Re-initialize chat with new system prompt context
    // We keep the UI history but the model gets a fresh context steer
    // Ideally, we might want to clear history or summarize, but for simplicity we keep history visually
    // but start a fresh session to ensure the "Context" is strong.
    initChat(subject);
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: Role.SYSTEM, // Using 'model' visually but it's a system notification
        text: `Switched context to **${subject}**. How can I help with that?`,
        timestamp: new Date()
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userText,
      timestamp: new Date()
    };
    
    // Add Placeholder Model Message
    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: Message = {
      id: modelMsgId,
      role: Role.MODEL,
      text: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMsg, modelMsg]);
    setIsLoading(true);

    try {
      await sendMessageStream(
        chatSessionRef.current,
        userText,
        (chunkText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId 
              ? { ...msg, text: msg.text + chunkText } 
              : msg
          ));
        }
      );
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text: "I'm sorry, I encountered an error. Please try again." } 
          : msg
      ));
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">StudyBuddy</h1>
        </div>
        <div className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
           Gemini Powered
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <SubjectSelector 
          currentSubject={currentSubject} 
          onSelect={handleSubjectChange} 
          disabled={isLoading} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          <div className="max-w-3xl mx-auto flex flex-col">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 pb-6 z-20">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-300 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask a ${currentSubject.toLowerCase()} question...`}
                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 resize-none max-h-32 min-h-[44px] py-2.5 px-3"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-xl mb-0.5 flex-shrink-0 transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              StudyBuddy can make mistakes. Double-check important info.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
