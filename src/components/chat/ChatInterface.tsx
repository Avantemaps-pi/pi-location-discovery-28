
import React from 'react';
import { Card } from '@/components/ui/card';
import ChatModeToggle from './ChatModeToggle';
import ChatMessage from './ChatMessage';
import { Menu, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">CHAT</h3>
            <ChatModeToggle chatMode={chatMode} onChatModeChange={onChatModeChange} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {chatMode === 'ai' 
              ? "Connect with Avante Maps AI assistant"
              : "Connect with Avante Maps LIVE Intern"}
          </p>
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh] min-h-[400px]">
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

        <div className="p-3 border-t">
          <div className="relative flex items-center">
            <div className="flex w-full bg-slate-50 rounded-full px-4 py-3">
              <button 
                onClick={handleAttachmentOption}
                className="text-gray-400 hover:text-gray-500 mr-2"
              >
                <Menu size={20} className="text-gray-400" />
              </button>

              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-600 placeholder:text-gray-500"
                placeholder="Type your message to Avante Maps..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />

              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="text-blue-500 hover:text-blue-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} className="transform rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
