
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessageProps } from '@/components/chat/ChatMessage';
import { ChatMode } from '@/components/chat/ChatInterface';

export function useChatState() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    { id: 1, text: "Welcome to Avante Maps!", sender: "system", timestamp: "10:30 AM" },
    { id: 2, text: "Hi there! How can I help with Avante Maps today?", sender: "support", timestamp: "10:32 AM" },
  ]);
  const [chatMode, setChatMode] = useState<ChatMode>("ai");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      
      // Add a response based on chat mode
      setTimeout(() => {
        const responseMessage = {
          id: messages.length + 2,
          text: chatMode === "ai" 
            ? "This is an AI-generated response. How can I assist you further?"
            : "A live agent has received your message. We'll respond as soon as possible.",
          sender: chatMode === "ai" ? "support" : "live-support",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
      
      setMessage("");
    }
  };

  const handleChatModeChange = (value: string) => {
    if (value && value !== chatMode) {
      if (value === "live") {
        // Redirect to pricing page when switching to LIVE chat
        navigate("/pricing");
      } else {
        setChatMode(value as ChatMode);
      }
    }
  };

  const handleAttachmentOption = (type: string) => {
    console.log(`Attachment type selected: ${type}`);
    // Implement actual attachment handling logic here
  };

  const sendVerificationRequest = (type: 'verification' | 'certification') => {
    const requestMessage = {
      id: messages.length + 1,
      text: type === 'verification' ? "Requesting Verification" : "Requesting Certification",
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, requestMessage]);
    
    // Add a response
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        text: `Your ${type} request has been received. Our team will review your application and get back to you shortly.`,
        sender: "support",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return {
    message,
    setMessage,
    messages,
    setMessages,
    chatMode,
    setChatMode,
    handleSendMessage,
    handleChatModeChange,
    handleAttachmentOption,
    sendVerificationRequest
  };
}
