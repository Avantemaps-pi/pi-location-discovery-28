
import React from 'react';
import { Card } from '@/components/ui/card';
import ChatModeToggle from './ChatModeToggle';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export type ChatMode = 'customer' | 'business';

interface ChatInterfaceProps {
  chatMode: ChatMode;
  onChatModeChange: (mode: ChatMode) => void;
  messages: any[];
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleAttachmentOption: () => void;
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
  showAttachmentIcon = true
}) => {
  return (
    <Card className="mt-6 overflow-hidden border-none shadow-md">
      <div className="flex h-full flex-col">
        <div className="border-b p-3">
          <ChatModeToggle chatMode={chatMode} onChatModeChange={onChatModeChange} />
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh] min-h-[300px]">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-muted-foreground">
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))
          )}
        </div>
  
        <ChatInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSendMessage}
          onAttachmentClick={handleAttachmentOption}
          placeholder={`Type a message as ${chatMode === 'customer' ? 'customer' : 'business'}...`}
          showAttachmentIcon={showAttachmentIcon}
        />
      </div>
    </Card>
  );
};

export default ChatInterface;
