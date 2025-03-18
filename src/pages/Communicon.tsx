
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, User, Calendar, Settings, Share2, Flag } from "lucide-react";
import { Button } from '@/components/ui/button';

const Communicon = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <AppLayout title="Communicon">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Pi Member since 2021</p>
            <div className="flex items-center justify-center sm:justify-start mt-2 gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">354 Followers</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <Button variant="outline" size="sm" className="mr-2">
              <Settings className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
            <Button size="sm">
              <User className="h-4 w-4 mr-1" />
              Follow
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="forums">Fireside Forums</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Pi Network enthusiast and early adopter. I'm passionate about cryptocurrency and the future of digital payments. I manage three businesses that accept Pi payments.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Stats</CardTitle>
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
          </TabsContent>
          
          <TabsContent value="forums" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fireside Forum Activity</CardTitle>
                <CardDescription>Your recent forum interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">How to increase Pi adoption in my local area?</h3>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        I've been trying to get more local businesses to accept Pi payments. Here's what worked for me...
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <div className="flex items-center mr-4">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>24 replies</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <Share2 className="h-3 w-3 mr-1" />
                          <span>Share</span>
                        </div>
                        <div className="flex items-center">
                          <Flag className="h-3 w-3 mr-1" />
                          <span>Report</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Forum Groups</CardTitle>
                <CardDescription>Communities you're a part of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Pi Merchants', 'Developer Hub', 'Pi Network News'].map((group) => (
                    <div key={group} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <h4 className="font-medium">{group}</h4>
                          <p className="text-xs text-muted-foreground">2.3k members</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Communicon;
