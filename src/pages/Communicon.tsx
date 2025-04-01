
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UserProfileCard from '@/components/chat/UserProfileCard';
import ChatInterface from '@/components/chat/ChatInterface';
import { useChatState } from '@/hooks/useChatState';

const Communicon = () => {
  const {
    message,
    setMessage,
    messages,
    chatMode,
    handleChatModeChange,
    handleSendMessage,
    handleAttachmentOption,
    sendVerificationRequest
  } = useChatState();

  useEffect(() => {
    window.sendVerificationRequest = sendVerificationRequest;
    
    return () => {
      window.sendVerificationRequest = undefined;
    };
  }, [sendVerificationRequest]);

  // Create wrapper function to match expected signature
  const handleSendMessageWrapper = () => {
    const event = new Event('submit') as unknown as React.FormEvent;
    handleSendMessage(event);
  };

  return (
    <AppLayout title="Avante Maps">
      <div className="max-w-4xl mx-auto">
        <UserProfileCard />
        <ChatInterface 
          chatMode={chatMode}
          onChatModeChange={handleChatModeChange}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessageWrapper}
          handleAttachmentOption={handleAttachmentOption}
          showAttachmentIcon={true}
        />
      </div>
    </AppLayout>
  );
};

export default Communicon;
