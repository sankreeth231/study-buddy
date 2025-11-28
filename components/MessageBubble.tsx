import React from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-medium uppercase tracking-wider">
          {isUser ? 'You' : 'StudyBuddy'}
        </div>
        <div className={`text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
           {isUser ? (
             <div className="whitespace-pre-wrap">{message.text}</div>
           ) : (
             <MarkdownRenderer content={message.text} />
           )}
        </div>
        {message.isStreaming && !isUser && (
           <div className="mt-2 flex space-x-1">
             <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
             <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
           </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
