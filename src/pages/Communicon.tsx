
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, User, Calendar, Settings, Share2, Flag, Mail, Link as LinkIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Communicon = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <AppLayout title="Communicon">
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
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-md">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">2.5 Years</span>
                <span className="text-sm text-muted-foreground">Pi Member</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">127</span>
                <span className="text-sm text-muted-foreground">Forum Posts</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">3</span>
                <span className="text-sm text-muted-foreground">Pi Businesses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Communicon;
