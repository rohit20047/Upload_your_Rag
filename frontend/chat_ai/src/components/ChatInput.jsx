import { useState } from 'react';
import { Send, FileText } from 'lucide-react';

export default function ChatInput({ 
  onSend, 
  onFileUpload, 
  darkMode,
  uploadStatus,

}) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center">
        <label 
          className={`mr-2 cursor-pointer`}
        >
          <input 
            type="file" 
            accept=".docx" 
            onChange={onFileUpload} 
            className="hidden"
          />
          <FileText 
            size={24} 
            className={`${
              darkMode 
                
                  ? 'text-gray-400 hover:text-gray-200'
                
                  
                  : 'text-gray-500 hover:text-indigo-600'
            }`} 
          />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className={`flex-1 p-2 border rounded-l-lg ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-gray-100 border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <button
          onClick={handleSend}
          className={`ml-2 p-3 border border-l-0 rounded-r-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}