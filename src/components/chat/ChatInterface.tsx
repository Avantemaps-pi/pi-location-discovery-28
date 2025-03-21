
import React, { useRef, useEffect } from 'react';
import { Bot, Radio } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import ChatModeToggle from './ChatModeToggle';

interface ChatInterfaceProps {
  chatMode: "ai" | "live";
  onChatModeChange: (value: string) => void;
  messages: ChatMessageProps[];
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleAttachmentOption: (type: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMode,
  onChatModeChange,
  messages,
  message,
  setMessage,
  handleSendMessage,
  handleAttachmentOption
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>Chat</CardTitle>
          </div>
          
          <ChatModeToggle chatMode={chatMode} onChatModeChange={onChatModeChange} />
        </div>
        <CardDescription>Connect with Avante Maps {chatMode === "ai" ? "AI assistant" : "support team"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px]">
          <ScrollArea 
            className="flex-1 pr-4 mb-4" 
            ref={scrollAreaRef}
          >
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  id={msg.id} 
                  text={msg.text} 
                  sender={msg.sender} 
                  timestamp={msg.timestamp} 
                />
              ))}
            </div>
          </ScrollArea>
          
          <ChatInput 
            chatMode={chatMode}
            onSendMessage={handleSendMessage}
            message={message}
            setMessage={setMessage}
            handleAttachmentOption={handleAttachmentOption}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
