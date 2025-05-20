import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { Menu, X } from 'lucide-react';
import { trimTitle } from './utils/trimTitle';
export default function Enter({email}) {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: "ai" },
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentChats')) || [];
    setRecentChats(stored);
  }, []);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuClick = async (item) => {
    console.log('Menu item clicked:', item);
    // Add your menu click handling logic here
    if (item === 'new-chat') {
      // Handle new chat logic

    } else if (item === 'recent-chats') {
      // Handle recent chats logic
    } else if (item === 'save-conversation') {
      const chat_id = uuidv4(); // Generate unique ID
      console.log('Generated chat_id:', chat_id);
    
      const newChat ={
        chat_id,
        data: messages
      }
    
      const updatedChats = [...recentChats, newChat];
      console.log('Updated chats:', updatedChats);
      setRecentChats(updatedChats);
    
      try {
        console.log('Saving conversation with data:', {
          email,
          chat_id,
          data: messages
        });
    
        const response = await fetch('https://parking-pens-cindy-beta.trycloudflare.com/api/save-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            chat_id,
            data: messages,
          }),
        });
    
        const result = await response.json();
        if (result.success) {
          // ✅ Call the /api/save-flag endpoint here
          const flagResponse = await fetch('https://parking-pens-cindy-beta.trycloudflare.com/api/save-flag', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              chat_id,
            }),
          });
    
          const flagResult = await flagResponse.json();
          if (flagResult.success) {
            localStorage.setItem('recentChats', JSON.stringify(updatedChats));
            alert("✅ Conversation saved and flagged successfully!");
          } else {
            alert("⚠️ Conversation saved, but failed to mark as saved.");
          }
        } else {
          alert("❌ Failed to save conversation.");
        }
      } catch (error) {
        console.error("🚨 Error saving conversation:", error);
        alert("❌ An error occurred while saving.");
      }
    }
    

    

  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-indigo-600 text-white'}`}>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-200"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
      <Sidebar 
      isMenuOpen={true} 
      darkMode={darkMode} 
      messages={messages}
      setMessages={setMessages}
      uploadedFile={uploadedFile}
      setUploadedFile={setUploadedFile}
      uploadStatus={uploadStatus}
      setUploadStatus={setUploadStatus}
      onMenuItemClick={handleMenuClick}
      recentChats={recentChats}
      setRecentChats={setRecentChats}
      email={email}
      
   
    />
        <ChatArea 
          messages={messages}
          setMessages={setMessages}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          uploadStatus={uploadStatus}
          setUploadStatus={setUploadStatus}
        
          darkMode={darkMode}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          
        />
      </div>

      {/* Footer */}
      <footer className={`p-3 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} text-sm`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0 text-center">
            © 2025 AI Chat Assistant Powered by Infinite mode. All rights reserved.
          </div>
          <div className="flex space-x-4 text-center">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

