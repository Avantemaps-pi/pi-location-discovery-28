
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LineChartComponent from './charts/LineChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import FullScreenChart from './charts/FullScreenChart';

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'line' | 'bar'>('line');
  const [xScale, setXScale] = useState(100);
  const [yScale, setYScale] = useState(100);
  const [timelineFilter, setTimelineFilter] = useState('7d'); // Default to 7d
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'line' | 'bar');
  };
  
  // Fixed style prop with valid CSS properties
  const containerStyle = {
    overflowX: "auto" as const,
    overflowY: "hidden" as const
  };
  
  // Calculate scale factors for normal view (not fullscreen)
  const chartWidth = '100%';
  const chartHeight = 300;
  
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
              <LineChartComponent 
                data={data}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                containerStyle={containerStyle}
              />
            </TabsContent>
            
            <TabsContent value="bar" className="space-y-4 w-full">
              <BarChartComponent 
                data={data}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                containerStyle={containerStyle}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FullScreenChart 
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        title={title}
        description={description}
        data={data}
        xScale={xScale}
        setXScale={setXScale}
        yScale={yScale}
        setYScale={setYScale}
        timelineFilter={timelineFilter}
        setTimelineFilter={setTimelineFilter}
      />
    </>
  );
};

export default EngagementChart;
