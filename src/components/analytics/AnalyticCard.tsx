
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnalyticCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  className?: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendDirection = 'neutral',
  className,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <div className="flex items-center mt-1 text-xs">
            {trend !== undefined && (
              <span 
                className={cn(
                  "mr-1 flex items-center",
                  trendDirection === 'up' && "text-green-500",
                  trendDirection === 'down' && "text-red-500"
                )}
              >
                {trendDirection === 'up' && '↑'}
                {trendDirection === 'down' && '↓'}
                {trendDirection === 'neutral' && '→'} 
                {trend}%
              </span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticCard;
