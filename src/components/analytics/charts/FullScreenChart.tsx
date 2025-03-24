
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minimize } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

// Updated timeline options to match the new requirements
const timelineOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" }
];

const FullScreenChart: React.FC<FullScreenChartProps> = React.memo(({
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
  
  // Use useMemo to calculate chart dimensions to avoid recalculations
  const { chartWidth, chartHeight, containerStyle } = useMemo(() => {
    // Calculate scale factors
    const xScaleFactor = xScale / 100;
    const yScaleFactor = yScale / 100;
    
    // Apply scale to chart dimensions
    const chartWidth = `${100 * xScaleFactor}%`;
    const chartHeight = (isMobile ? 400 : 700) * yScaleFactor; // Increased height for better visibility
    
    // Fixed style prop with valid CSS properties
    const containerStyle = {
      overflowX: "auto" as const,
      overflowY: "hidden" as const
    };

    return { chartWidth, chartHeight, containerStyle };
  }, [xScale, yScale, isMobile]);
  
  // Handle zoom instructions
  const zoomInstructions = (
    <div className="text-xs text-muted-foreground mb-2 italic">
      Use Ctrl + Mouse Wheel to zoom in/out on the chart
    </div>
  );
  
  // Memoize the chart component to prevent unnecessary re-renders
  const chartComponent = useMemo(() => {
    if (activeTab === 'line') {
      return (
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
      );
    } else {
      return (
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
      );
    }
  }, [activeTab, data, chartWidth, chartHeight, containerStyle, xScale, yScale, setXScale, setYScale]);
  
  return (
    <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
      <DialogContent className="max-w-[95vw] w-[95vw] md:max-w-[90vw] flex flex-col p-4" hideCloseButton>
        <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsFullScreen(false)}
            title="Exit Full Screen"
            className="ml-2"
          >
            <Minimize className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4 mb-2">
          <ToggleGroup 
            type="single" 
            value={timelineFilter} 
            onValueChange={(value) => value && setTimelineFilter(value)}
            className="justify-start bg-muted/20 p-1 rounded-lg"
          >
            {timelineOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={`Filter by ${option.label}`}
                className="data-[state=on]:bg-background data-[state=on]:text-foreground px-3 py-1 text-sm"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        {zoomInstructions}
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col">
          <div className="flex items-center mb-2">
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 w-full overflow-hidden">
            {chartComponent}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});

FullScreenChart.displayName = 'FullScreenChart';

export default FullScreenChart;
