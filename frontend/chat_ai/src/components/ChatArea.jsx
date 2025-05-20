import MessageList from './MessageList';
import UploadStatus from './UploadStatus';
import ChatInput from './ChatInput';
import { handleSend, handleFileUpload } from '../utils/services';



export default function ChatArea({ 
  messages, 
  setMessages, 
  uploadedFile, 
  setUploadedFile, 
  uploadStatus, 
  setUploadStatus, 
  darkMode,
  isLoading,
  setIsLoading,
}) {
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MessageList messages={messages} darkMode={darkMode} loading={isLoading} />
      <UploadStatus 
        uploadStatus={uploadStatus} 
        uploadedFile={uploadedFile} 
        darkMode={darkMode} 
      />
      <ChatInput 
        onSend={(input) => handleSend(input, messages, setMessages,setIsLoading)} 
        onFileUpload={(e) => handleFileUpload(e, messages, setMessages, setUploadedFile, setUploadStatus)} 
        darkMode={darkMode} 
        uploadStatus={uploadStatus}
        
      />
    </div>
  );
}