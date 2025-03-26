
import React from 'react';
import { Card } from '@/components/ui/card';
import ChatModeToggle from './ChatModeToggle';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export type ChatMode = 'ai' | 'live';

interface ChatInterfaceProps {
  chatMode: 'ai' | 'live';
  onChatModeChange: (mode: 'ai' | 'live') => void;
  messages: Array<{
    id: number;
    text: string;
    sender: string;
    timestamp: string;
  }>;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleAttachmentOption?: () => void;
  showAttachmentIcon?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMode,
  onChatModeChange,
  messages,
  message,
  setMessage,
  handleSendMessage,
  handleAttachmentOption,
  showAttachmentIcon = false
}) => {
  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md">
      <div className="flex h-full flex-col">
        <div className="border-b p-3">
          <ChatModeToggle chatMode={chatMode} onChatModeChange={onChatModeChange} />
          <p className="text-sm text-muted-foreground mt-2">
            Connect with Avante Maps AI assistant
          </p>
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh] min-h-[300px]">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-muted-foreground">
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                id={msg.id}
                text={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
              />
            ))
          )}
        </div>
  
        <ChatInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSendMessage}
          onAttachmentClick={handleAttachmentOption}
          placeholder={`Type a message as ${chatMode === 'ai' ? 'AI assistant' : 'live agent'}...`}
          showAttachmentIcon={showAttachmentIcon}
        />
      </div>
    </Card>
  );
};

export default ChatInterface;
