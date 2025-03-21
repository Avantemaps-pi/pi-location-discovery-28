
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, User, Calendar, Settings, Share2, Flag, Mail, Link as LinkIcon, Check, Bot, Zap, Radio, Paperclip, Image, SendHorizontal } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Communicon = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Avante Maps!", sender: "system", timestamp: "10:30 AM" },
    { id: 2, text: "Hi there! How can I help with Avante Maps today?", sender: "support", timestamp: "10:32 AM" },
  ]);
  const [chatMode, setChatMode] = useState<"ai" | "live">("ai");

  const handleSendMessage = (e) => {
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

  const handleChatModeChange = (value) => {
    if (value && value !== chatMode) {
      if (value === "live") {
        // Redirect to pricing page when switching to LIVE chat
        navigate("/pricing");
      } else {
        setChatMode(value as "ai" | "live");
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

  // Export the function so it can be used from other components
  window.sendVerificationRequest = sendVerificationRequest;

  return (
    <AppLayout title="Avante Maps">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-2">**** ***</h2>
              
              <div className="space-y-3 w-full max-w-md">
                <div className="flex items-center">
                  <span className="text-gray-600 w-40">Email:</span>
                  <span className="text-gray-800">******</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-600 w-40">Joined:</span>
                  <span className="text-gray-800">*****</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-600 w-40">Preferred Payment:</span>
                  <span className="text-gray-800">Pi Coin</span>
                </div>
              </div>
              
              <div className="w-full mt-6">
                <Button variant="outline" className="w-full flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link Fireside Forum
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle>Chat</CardTitle>
              </div>
              
              {/* AI/LIVE toggle button */}
              <ToggleGroup 
                type="single" 
                variant="outline"
                value={chatMode}
                onValueChange={handleChatModeChange}
                className="border rounded-md"
              >
                <ToggleGroupItem value="ai" className="px-3 py-1 text-xs">
                  <Zap className="h-4 w-4 mr-1" />
                  AI
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="live" 
                  className={`px-3 py-1 text-xs ${chatMode === "live" ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
                >
                  <Radio className="h-4 w-4 mr-1" />
                  LIVE
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <CardDescription>Connect with Avante Maps {chatMode === "ai" ? "AI assistant" : "support team"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[400px]">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : msg.sender === 'system'
                              ? 'bg-gray-200 text-gray-800'
                              : msg.sender === 'live-support'
                                ? 'bg-red-100 border border-red-300 text-gray-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <form onSubmit={handleSendMessage} className="relative">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Communicon;
