
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, ZAxis } from 'recharts';

interface ChartData {
  name: string;
  views: number;
  clicks: number;
  bookmarks: number;
}

interface LineChartComponentProps {
  data: ChartData[];
  chartWidth: string;
  chartHeight: number;
  containerStyle: {
    overflowX: "auto";
    overflowY: "hidden";
  };
  xScale?: number;
  yScale?: number;
  onXScaleChange?: (scale: number) => void;
  onYScaleChange?: (scale: number) => void;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ 
  data, 
  chartWidth, 
  chartHeight, 
  containerStyle,
  xScale = 100,
  yScale = 100,
  onXScaleChange,
  onYScaleChange
}) => {
  const [localXScale, setLocalXScale] = useState(xScale);
  const [localYScale, setLocalYScale] = useState(yScale);

  // Calculate scale factors
  const xScaleFactor = localXScale / 100;
  const yScaleFactor = localYScale / 100;
  
  // Find the maximum values for the Y axis
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.views, item.clicks, item.bookmarks))
  );
  
  const handleWheel = (e: React.WheelEvent) => {
    // Ctrl key for zooming
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      
      const newXScale = Math.max(50, Math.min(300, localXScale + delta));
      const newYScale = Math.max(50, Math.min(300, localYScale + delta));
      
      setLocalXScale(newXScale);
      setLocalYScale(newYScale);
      
      onXScaleChange?.(newXScale);
      onYScaleChange?.(newYScale);
    }
  };
  
  return (
    <div 
      className="w-full overflow-auto" 
      onWheel={handleWheel}
    >
      <ResponsiveContainer width={chartWidth} height={chartHeight} style={containerStyle}>
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            scale={xScaleFactor > 1 ? 'band' : 'auto'}
            interval={xScaleFactor < 1 ? Math.round(1 / xScaleFactor) - 1 : 0}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            domain={[0, maxValue * (1 / yScaleFactor)]}
          />
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
};

export default LineChartComponent;

