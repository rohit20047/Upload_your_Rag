import { Home, MessageSquare, Book, Upload, Settings, HelpCircle, LogOut,Trash2 } from 'lucide-react';
import { SaveChats } from '../utils/services';
import { useEffect } from 'react';
export default function Sidebar({ 
  isMenuOpen, 
  darkMode, 
  onMenuItemClick, 
  setMessages, 
  uploadedFile, 
  setUploadedFile, 
  uploadStatus, 
  setUploadStatus, 
  messages,
  recentChats,
  setRecentChats,
  email,
 
}) {
  useEffect(() => {
    setTimeout(() => {
    const stored = JSON.parse(localStorage.getItem('recentChats')) || [];
    setRecentChats(stored);
    }, 2000);
  }, []);
  const handleMenuClick = (item) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadStatus('error');
      const errorMessage = { 
        id: messages.length + 1, 
        text: 'No file selected', 
        sender: "ai" 
      };
      setMessages([...messages, errorMessage]);
      return;
    }

    if (file.name.endsWith('.docx')) {
      setUploadedFile(file);
      setUploadStatus('success');

      const formData = new FormData();
      formData.append('document', file);

      try {
        const response = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          const newMessage = { 
            id: messages.length + 1, 
            text: `File "${file.name}" uploaded and processed successfully.`, 
            sender: "ai" 
          };
          setMessages([...messages, newMessage]);
        } else {
          setUploadStatus('error');
          const errorMessage = { 
            id: messages.length + 1, 
            text: `Error uploading file: ${data.message}`, 
            sender: "ai" 
          };
          setMessages([...messages, errorMessage]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('error');
        const errorMessage = { 
          id: messages.length + 1, 
          text: 'Error: Failed to upload file to the server', 
          sender: "ai" 
        };
        setMessages([...messages, errorMessage]);
      }
    } else {
      setUploadStatus('error');
      const errorMessage = { 
        id: messages.length + 1, 
        text: 'Please upload a .docx file', 
        sender: "ai" 
      };
      setMessages([...messages, errorMessage]);
    }
  };
  const handleDeleteChat = async (chatId) => {
    try {
      console.log('Deleting chat with ID:', chatId);
      await fetch('http://localhost:3000/api/delete-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });
      await SaveChats(email);
      let updatedChats = JSON.parse(localStorage.getItem('recentChats'));
      updatedChats = updatedChats.filter(chat => chat.id !== chatId);
      localStorage.setItem('recentChats', JSON.stringify(updatedChats));
      setRecentChats(updatedChats);
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  return (
    <div
      className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Static Menu */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Conversations</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleMenuClick('new-chat')}
                className={`flex items-center space-x-2 w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Home size={20} />
                <span>New Chat</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick('recent-chats')}
                className={`flex items-center space-x-2 w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare size={20} />
                <span>Recent Chats</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick('save-conversation')}
                className={`flex items-center space-x-2 w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Book size={20} />
                <span>Save Conversation</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Recent Chats List */}
        {recentChats && recentChats.length > 0 && (
          <div className="mt-6 flex-1 overflow-y-auto">
            <h3 className="text-md font-medium mb-2">Your Chats</h3>
            <ul className="space-y-1">
               {recentChats.map(chat => (
                <li key={chat.chat_id} className={ `flex items-center space-x-2 p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <button
                    onClick={() => setMessages(chat.data)}
                    className={'flex-grow text-left truncate p-2 border-b ' + (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}
                  >
                    {`${chat.data[1].text}...`}
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.chat_id)}
                    className="ml-2 p-1 hover:text-red-500"
                    title="Delete Chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools & Sign Out */}
        <div className="mt-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Tools</h2>
            <ul className="space-y-2">
              <li>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className={`flex items-center space-x-2 p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Upload size={20} />
                    <span>Upload Files</span>
                  </span>
                </label>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('settings')}
                  className={`flex items-center space-x-2 w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('help-center')}
                  className={`flex items-center space-x-2 w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <HelpCircle size={20} />
                  <span>Help Center</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={() => handleMenuClick('sign-out')}
              className={`flex items-center space-x-2 w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
