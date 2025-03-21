
import React, { useState } from 'react';
import { Paperclip, SendHorizontal, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ChatInputProps {
  chatMode: "ai" | "live";
  onSendMessage: (e: React.FormEvent) => void;
  message: string;
  setMessage: (message: string) => void;
  handleAttachmentOption: (type: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  chatMode, 
  onSendMessage, 
  message, 
  setMessage,
  handleAttachmentOption
}) => {
  return (
    <form onSubmit={onSendMessage} className="relative">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Type your message to ${chatMode === "ai" ? "AI" : "support"}...`}
        className="flex-1 pr-10 pl-10 py-4 h-14 bg-gray-50 border-gray-200"
      />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 opacity-70 hover:opacity-100"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-20 p-0" align="start">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAttachmentOption('photos')}
            >
              <Image className="h-5 w-5 text-gray-600" />
              <span className="text-gray-800 text-sm">Photos</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 opacity-70 hover:opacity-100"
      >
        <SendHorizontal className="h-5 w-5 text-primary" />
      </Button>
    </form>
  );
};

export default ChatInput;
