import { useState } from "react";
export const handleSend = async (input, messages, setMessages, setLoading) => {
  const newMessage = { id: messages.length + 1, text: input, sender: "user" };
  setMessages([...messages, newMessage]);

  setLoading(true); // Start loading when message is sent

  try {
    const response = await fetch('http://localhost:3000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: input }),
    });

    const data = await response.json();

    if (data.success) {
      const aiResponse = { 
        id: messages.length + 2, 
        text: data.response, 
        sender: "ai" 
      };
      setMessages(prev => [...prev, aiResponse]);
    } else {
      const errorResponse = { 
        id: messages.length + 2, 
        text: `Error: ${data.message}`, 
        sender: "ai" 
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  } catch (error) {
    console.error('Error sending query:', error);
    const errorResponse = { 
      id: messages.length + 2, 
      text: 'Error: Failed to connect to the server', 
      sender: "ai" 
    };
    setMessages(prev => [...prev, errorResponse]);
  } finally {
    setLoading(false); // Stop loading after response or error
  }
};

export const handleFileUpload = async (e, messages, setMessages, setUploadedFile, setUploadStatus) => {
  const file = e.target.files[0];
 console.log("file is",file)
  console.log("up loading ")
  if (file && file.name.endsWith('.docx')) {

 
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
        setUploadStatus(null);
       
      } else {
        setUploadStatus('error');
        const errorMessage = { 
          id: messages.length + 1, 
          text: `Error uploading file: ${data.message}`, 
          sender: "ai" 
        };
        setMessages([...messages, errorMessage]);
        setUploadStatus(null);
       
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