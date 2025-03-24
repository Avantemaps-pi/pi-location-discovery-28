
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minimize } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ChartSettings from './ChartSettings';
import LineChartComponent from './LineChartComponent';
import BarChartComponent from './BarChartComponent';

interface ChartData {
  name: string;
  views: number;
  clicks: number;
  bookmarks: number;
}

interface FullScreenChartProps {
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
  activeTab: 'line' | 'bar';
  handleTabChange: (value: string) => void;
  title: string;
  description?: string;
  data: ChartData[];
  xScale: number;
  setXScale: (value: number) => void;
  yScale: number;
  setYScale: (value: number) => void;
  timelineFilter: string;
  setTimelineFilter: (value: string) => void;
}

const FullScreenChart: React.FC<FullScreenChartProps> = ({
  isFullScreen,
  setIsFullScreen,
  activeTab,
  handleTabChange,
  title,
  description,
  data,
  xScale,
  setXScale,
  yScale,
  setYScale,
  timelineFilter,
  setTimelineFilter
}) => {
  const isMobile = useIsMobile();
  
  // Calculate scale factors
  const xScaleFactor = xScale / 100;
  const yScaleFactor = yScale / 100;
  
  // Apply scale to chart dimensions
  const chartWidth = `${100 * xScaleFactor}%`;
  const chartHeight = (isMobile ? 300 : 600) * yScaleFactor;
  
  // Fixed style prop with valid CSS properties
  const containerStyle = {
    overflowX: "auto" as const,
    overflowY: "hidden" as const
  };
  
  return (
    <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
      <DialogContent className="max-w-[95vw] h-[90vh] w-[95vw] md:max-w-[90vw] md:h-[85vh] flex flex-col p-6" hideCloseButton>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsFullScreen(false)}
            title="Exit Full Screen"
          >
            <Minimize className="h-4 w-4" />
          </Button>
        </div>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        
        <ChartSettings 
          xScale={xScale}
          setXScale={setXScale}
          yScale={yScale}
          setYScale={setYScale}
          timelineFilter={timelineFilter}
          setTimelineFilter={setTimelineFilter}
        />
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center mb-4">
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 w-full">
            {activeTab === 'line' ? (
              <LineChartComponent 
                data={data} 
                chartWidth={chartWidth} 
                chartHeight={chartHeight} 
                containerStyle={containerStyle} 
              />
            ) : (
              <BarChartComponent 
                data={data} 
                chartWidth={chartWidth} 
                chartHeight={chartHeight} 
                containerStyle={containerStyle} 
              />
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenChart;
