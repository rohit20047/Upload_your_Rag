import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages, darkMode, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} darkMode={darkMode} />
        ))}

        {loading && (
          <div className="flex items-center space-x-2 animate-pulse text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 bg-current rounded-full"></span>
            <span className="w-2 h-2 bg-current rounded-full"></span>
            <span className="w-2 h-2 bg-current rounded-full"></span>
            <span>Typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
