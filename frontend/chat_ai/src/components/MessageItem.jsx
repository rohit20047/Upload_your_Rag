import { User, Bot } from 'lucide-react';

export default function MessageItem({ message, darkMode }) {
  const renderTextWithHeading = (text, sender) => {
    const parts = text.split(/(\*\*.*?\*\*)/);

    return parts
      .map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const headingText = part.slice(2, -2);
          return (
            <h2
              className={`font-bold text-lg mt-4 mb-2 text-left ${
                sender === 'user' ? 'text-white' : darkMode ? 'text-white' : 'text-black'
              }`}
              key={index}
            >
              {headingText}
            </h2>
          );
        } else {
          const lines = part.split('\n');

          return lines.map((line, lineIndex) => {
            if (!line.trim()) return null;

            const cleanedLine = line.replace(/^\s*\*\s*/, '').trim();

            if (cleanedLine) {
              return (
                <p
                  className={`mb-1 leading-snug text-left ${
                    sender === 'user' ? 'text-white' : darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}
                  key={`${index}-${lineIndex}`}
                >
                  {cleanedLine}
                </p>
              );
            }
            return null;
          });
        }
      })
      .flat()
      .filter(Boolean);
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3/4 p-3 rounded-lg ${
          message.sender === 'user'
            ? `${darkMode ? 'bg-indigo-700' : 'bg-indigo-600'} text-white`
            : `${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`
        } flex items-start`}
      >
        <div
          className={`mr-2 ${message.sender === 'user' ? 'order-2 ml-2' : 'order-1 mr-2'}`}
        >
          {message.sender === 'user' ? (
            <div className="bg-indigo-800 rounded-full p-1 text-white">
              <User size={18} />
            </div>
          ) : (
            <div className={`${darkMode ? 'bg-green-700' : 'bg-green-500'} rounded-full p-1`}>
              <Bot size={18} className="text-black" />
            </div>
          )}
        </div>
        <div className={message.sender === 'user' ? 'order-1' : 'order-2'}>
          {renderTextWithHeading(message.text, message.sender)}
        </div>
      </div>
    </div>
  );
}
