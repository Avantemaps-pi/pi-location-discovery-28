
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ChartSettingsProps {
  xScale: number;
  setXScale: (value: number) => void;
  yScale: number;
  setYScale: (value: number) => void;
  timelineFilter: string;
  setTimelineFilter: (value: string) => void;
}

const ChartSettings: React.FC<ChartSettingsProps> = ({
  xScale,
  setXScale,
  yScale,
  setYScale,
  timelineFilter,
  setTimelineFilter
}) => {
  return (
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
  );
};

export default ChartSettings;
