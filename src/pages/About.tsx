
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PiSquare, Globe, Search, Map, Shield, Users } from 'lucide-react';

const About = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Avante Maps</h1>
          <p className="text-muted-foreground mt-2">Discover the story and mission behind our platform.</p>
        </div>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-3 rounded-lg">
                <PiSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription>Connecting Pi users with businesses worldwide</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="leading-7">
              Avante Maps is a premier location-based platform designed specifically for Pi Network users, with the sole purpose of increasing discoverability of businesses that accept Pi coin as a form of payment onsite. Our mission is to bridge the gap between the digital Pi ecosystem and physical retail spaces, making it easier for users to spend their Pi cryptocurrency in real-world settings.
            </p>
            <p className="leading-7 mt-4">
              By creating a comprehensive directory of Pi-accepting businesses, we aim to accelerate the adoption of Pi as a legitimate currency and help businesses that embrace cryptocurrency to thrive in the evolving digital economy.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <Map className="h-6 w-6 mb-2 text-avante-purple" />
                <CardTitle className="text-xl">Interactive Maps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Explore Pi-accepting businesses on our interactive map interface, making it easy to find locations near you.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Search className="h-6 w-6 mb-2 text-avante-blue" />
                <CardTitle className="text-xl">Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Find exactly what you're looking for with our powerful search functionality, filtering by business type, location, and more.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Shield className="h-6 w-6 mb-2 text-avante-teal" />
                <CardTitle className="text-xl">Verified Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">All businesses on our platform are verified to accept Pi payments, ensuring a seamless experience for users.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Team</CardTitle>
            <CardDescription>The passionate individuals behind Avante Maps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-avante-blue to-avante-purple flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-lg">Tapelo Daniel</h3>
                <p className="text-sm text-muted-foreground">IT Support Specialist & Software Developer (In Training)</p>
                <p className="mt-2 text-sm">Pi Network enthusiast with a background in geospatial technology and blockchain solutions.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-avante-blue to-avante-purple flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-lg">Loyiso Xulu</h3>
                <p className="text-sm text-muted-foreground">Software Engineer & System Architect</p>
                <p className="mt-2 text-sm">Software engineer specializing in mapping technologies and cryptocurrency integration.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-avante-blue to-avante-purple flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-lg">Neo Memani</h3>
                <p className="text-sm text-muted-foreground">Financial Analyst & Market Strategist</p>
                <p className="mt-2 text-sm">Working directly with businesses to expand our network of Pi-accepting merchants.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-avante-teal to-avante-blue p-3 rounded-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
                <CardDescription>The future of Pi payments and Avante Maps</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="leading-7">
              We envision a world where cryptocurrency, particularly Pi, becomes a mainstream payment method across global markets. Avante Maps aims to be at the forefront of this revolution, creating the infrastructure needed to connect consumers with businesses in the Pi ecosystem.
            </p>
            <p className="leading-7 mt-4">
              As Pi Network continues to grow, we plan to expand our services to include more features such as in-app payments, loyalty programs, and enhanced business analytics for our listed merchants. Our ultimate goal is to become the definitive platform for discovering and engaging with Pi-accepting businesses worldwide.
            </p>
          </CardContent>
        </Card>

        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">© 2023 Avante Maps. All rights reserved.</p>
          <p className="text-sm text-muted-foreground mt-1">Proudly supporting the Pi Network ecosystem.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
