
import React, { useState, useMemo } from 'react';
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

const EngagementChart: React.FC<EngagementChartProps> = React.memo(({ data, title, description }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'line' | 'bar'>('line');
  const [xScale, setXScale] = useState(100);
  const [yScale, setYScale] = useState(100);
  const [timelineFilter, setTimelineFilter] = useState('week'); // Default to week
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'line' | 'bar');
  };
  
  // Memoize these values to prevent recalculation on each render
  const { containerStyle, chartWidth, chartHeight } = useMemo(() => {
    // Fixed style prop with valid CSS properties
    const containerStyle = {
      overflowX: "auto" as const,
      overflowY: "hidden" as const
    };
    
    // Adjust chart dimensions to fit properly within container
    const chartWidth = '100%';
    const chartHeight = 250; // Keep the chart height the same
    
    return { containerStyle, chartWidth, chartHeight };
  }, []);
  
  // Memoize chart components to prevent unnecessary re-renders
  const lineChartComponent = useMemo(() => (
    <div className="h-full w-full">
      <LineChartComponent 
        data={data}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
        containerStyle={containerStyle}
        xScale={xScale}
        yScale={yScale}
        onXScaleChange={setXScale}
        onYScaleChange={setYScale}
      />
    </div>
  ), [data, chartWidth, chartHeight, containerStyle, xScale, yScale]);

  const barChartComponent = useMemo(() => (
    <div className="h-full w-full">
      <BarChartComponent 
        data={data}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
        containerStyle={containerStyle}
        xScale={xScale}
        yScale={yScale}
        onXScaleChange={setXScale}
        onYScaleChange={setYScale}
      />
    </div>
  ), [data, chartWidth, chartHeight, containerStyle, xScale, yScale]);
  
  return (
    <>
      <Card className="w-full h-full">
        <CardHeader className="pb-0">
          <CardTitle className="whitespace-nowrap">{title}</CardTitle>
          {description && <CardDescription className="whitespace-nowrap">{description}</CardDescription>}
          
          <div className="flex items-center justify-between mt-2">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
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
        </CardHeader>
        <CardContent className="pl-0 pt-2 h-[400px]">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
            <TabsContent value="line" className="flex-1 h-full">
              {lineChartComponent}
            </TabsContent>
            
            <TabsContent value="bar" className="flex-1 h-full">
              {barChartComponent}
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
});

EngagementChart.displayName = 'EngagementChart';

export default EngagementChart;
