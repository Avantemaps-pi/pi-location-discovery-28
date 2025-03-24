
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  views: number;
  clicks: number;
  bookmarks: number;
}

interface BarChartComponentProps {
  data: ChartData[];
  chartWidth: string;
  chartHeight: number;
  containerStyle: {
    overflowX: "auto";
    overflowY: "hidden";
  };
  xScale?: number;
  yScale?: number;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ 
  data, 
  chartWidth, 
  chartHeight, 
  containerStyle,
  xScale = 100,
  yScale = 100
}) => {
  // Calculate scale factors
  const xScaleFactor = xScale / 100;
  const yScaleFactor = yScale / 100;
  
  // Find the maximum values for the Y axis
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.views, item.clicks, item.bookmarks))
  );
  
  return (
    <div className="w-full overflow-auto">
      <ResponsiveContainer width={chartWidth} height={chartHeight} style={containerStyle}>
        <BarChart 
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
          <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="bookmarks" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
