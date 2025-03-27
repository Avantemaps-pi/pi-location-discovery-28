
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts';

interface DistributionData {
  name: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  data: DistributionData[];
  title: string;
  description?: string;
}

const RADIAN = Math.PI / 180;

// Modified label rendering function to position labels closer to center
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  // Move radius closer to center (from 0.8 to 0.65)
  const radius = outerRadius * 0.65;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Define the type for CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: any;
    color?: string;
  }>;
  label?: string;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, title, description }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Custom tooltip content with proper typing
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 rounded-md shadow-md border border-border text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend that arranges items in two rows for Traffic Sources chart
  const CustomizedLegend = (props) => {
    const { payload } = props;
    
    // Only apply the custom layout for Traffic Sources chart (4 items)
    if (payload.length === 4) {
      const firstRow = payload.slice(0, 2);
      const secondRow = payload.slice(2, 4);
      
      return (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="flex justify-center gap-4">
            {firstRow.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs">{entry.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            {secondRow.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // For other charts, use the default legend
    return (
      <div className="flex justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[240px] flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                activeIndex={activeIndex}
                activeShape={(props) => {
                  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                  return (
                    <g>
                      <path 
                        d={`M${cx},${cy} L${cx + outerRadius * Math.cos(-startAngle * RADIAN)},${cy + outerRadius * Math.sin(-startAngle * RADIAN)} A${outerRadius},${outerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0},0 ${cx + outerRadius * Math.cos(-endAngle * RADIAN)},${cy + outerRadius * Math.sin(-endAngle * RADIAN)} Z`} 
                        fill={fill}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </g>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={activeIndex === index ? "#ffffff" : "transparent"} 
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomizedLegend />} verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionChart;
