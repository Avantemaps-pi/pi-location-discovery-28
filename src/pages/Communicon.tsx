
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
    handleSendMessage,
    handleChatModeChange,
    handleAttachmentOption,
    sendVerificationRequest
  } = useChatState();

  useEffect(() => {
    window.sendVerificationRequest = sendVerificationRequest;
    
    return () => {
      window.sendVerificationRequest = undefined;
    };
  }, [sendVerificationRequest]);

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
          handleSendMessage={handleSendMessage}
          handleAttachmentOption={handleAttachmentOption}
          showAttachmentIcon={false}
        />
      </div>
    </AppLayout>
  );
};

export default Communicon;
