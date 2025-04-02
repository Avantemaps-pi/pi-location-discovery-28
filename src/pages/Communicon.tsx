import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UserProfileCard from '@/components/chat/UserProfileCard';
import ChatInterface from '@/components/chat/ChatInterface';
import { useChatState } from '@/hooks/useChatState';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { SubscriptionTier } from '@/utils/piNetworkUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Communicon = () => {
  const navigate = useNavigate();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { hasPermission, isLoading } = useFeatureAccess(
    SubscriptionTier.SMALL_BUSINESS,
    { redirectTo: '' } // We'll handle redirection within the component
  );
  
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
  
  // Create a wrapper for handleAttachmentOption that doesn't take any parameters
  const handleAttachmentOptionWrapper = () => {
    if (handleAttachmentOption) {
      handleAttachmentOption('default');
    }
  };

  // Handle the chat mode change
  const handleCustomChatModeChange = (value: string) => {
    // If trying to switch to LIVE chat
    if (value === 'live') {
      // Check if they have permission
      if (!hasPermission) {
        // Show upgrade dialog instead of changing mode
        setShowUpgradePrompt(true);
        return;
      }
    }
    // Otherwise proceed with normal chat mode change
    handleChatModeChange(value);
  };

  const closeUpgradePrompt = () => {
    setShowUpgradePrompt(false);
  };

  return (
    <AppLayout title="Avante Maps">
      <div className="max-w-4xl mx-auto">
        <UserProfileCard />
        <ChatInterface 
          chatMode={chatMode}
          onChatModeChange={handleCustomChatModeChange}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessageWrapper}
          handleAttachmentOption={handleAttachmentOptionWrapper}
          showAttachmentIcon={true}
        />
      </div>

      <Dialog open={showUpgradePrompt} onOpenChange={setShowUpgradePrompt}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 flex flex-col items-center space-y-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center">LIVE Chat Support Available with Business Subscription</h2>
            <p className="text-muted-foreground text-center">
              Access direct LIVE chat support with our team by upgrading to our Small Business plan.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={closeUpgradePrompt}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  navigate('/pricing', { state: { fromLiveChat: true } });
                }}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Communicon;
