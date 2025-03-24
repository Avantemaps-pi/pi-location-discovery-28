
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [xScale, setXScale] = useState(100);
  const [yScale, setYScale] = useState(100);
  const [timelineFilter, setTimelineFilter] = useState('week');
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'line' | 'bar');
  };
  
  const renderChart = (type: 'line' | 'bar', height: number = 300, scaleX = 100, scaleY = 100) => {
    // Calculate scale factors (100 = normal, 200 = 2x, etc.)
    const xScaleFactor = scaleX / 100;
    const yScaleFactor = scaleY / 100;
    
    // Apply scale to chart dimensions
    const chartWidth = `${100 * xScaleFactor}%`;
    const chartHeight = height * yScaleFactor;
    
    // Fixed style prop with valid CSS properties
    const containerStyle = {
      overflowX: "auto" as const,
      overflowY: "hidden" as const
    };
    
    if (type === 'line') {
      return (
        <div className="w-full overflow-auto">
          <ResponsiveContainer width={chartWidth} height={chartHeight} style={containerStyle}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 15 }} />
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
        </div>
      );
    } else {
      return (
        <div className="w-full overflow-auto">
          <ResponsiveContainer width={chartWidth} height={chartHeight} style={containerStyle}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 15 }} />
              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookmarks" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
        <DialogContent className="max-w-[95vw] h-[90vh] w-[95vw] md:max-w-[90vw] md:h-[85vh] flex flex-col p-6" hideCloseButton>
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
          {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">X-Axis Scale</span>
                <span className="text-sm text-muted-foreground">{xScale}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[xScale]}
                  min={50}
                  max={300}
                  step={10}
                  onValueChange={(value) => setXScale(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Y-Axis Scale</span>
                <span className="text-sm text-muted-foreground">{yScale}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[yScale]}
                  min={50}
                  max={300}
                  step={10}
                  onValueChange={(value) => setYScale(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Time Period</span>
              </div>
              <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex items-center mb-4">
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 w-full">
              {renderChart(activeTab, isMobile ? 300 : 600, xScale, yScale)}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EngagementChart;
