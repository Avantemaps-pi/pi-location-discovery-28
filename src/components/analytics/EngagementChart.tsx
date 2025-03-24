
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ChartData {
  name: string;
  views: number;
  clicks: number;
  bookmarks: number;
}

interface EngagementChartProps {
  data: ChartData[];
  title: string;
  description?: string;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data, title, description }) => {
  const isMobile = useIsMobile();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'line' | 'bar'>('line');
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'line' | 'bar');
  };
  
  const renderChart = (type: 'line' | 'bar', height: number = 300) => {
    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="bookmarks" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bookmarks" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pl-0">
          <Tabs defaultValue="line" onValueChange={handleTabChange}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleFullScreen} 
                title="Full Screen"
                className="mr-4"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
            
            <TabsContent value="line" className="space-y-4 w-full">
              {renderChart('line')}
            </TabsContent>
            
            <TabsContent value="bar" className="space-y-4 w-full">
              {renderChart('bar')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-screen-lg w-[90vw]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFullScreen}
              title="Exit Full Screen"
            >
              <Minimize className="h-4 w-4" />
            </Button>
          </div>
          {description && <p className="text-sm text-gray-500 mb-6">{description}</p>}
          {renderChart(activeTab, 500)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EngagementChart;
