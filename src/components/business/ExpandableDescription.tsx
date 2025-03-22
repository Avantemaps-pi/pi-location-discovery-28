
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExpandableDescriptionProps {
  text: string;
  maxLines?: number;
  className?: string;
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ 
  text, 
  maxLines = 4,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if the text overflows and needs a "read more" button
  useEffect(() => {
    const checkOverflow = () => {
      const element = textRef.current;
      if (element) {
        // Get line height in pixels
        const style = window.getComputedStyle(element);
        const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2;
        const maxHeight = lineHeight * maxLines;
        
        setNeedsExpansion(element.scrollHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text, maxLines]);

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className={`w-full ${className}`}
    >
      <div className={`relative overflow-hidden ${!isExpanded ? 'max-h-[4.8em]' : ''}`}>
        <p 
          ref={textRef} 
          className={`text-sm text-gray-700 ${!isExpanded ? 'line-clamp-4' : ''}`}
        >
          {text}
        </p>
        
        {needsExpansion && !isExpanded && (
          <CollapsibleTrigger className="absolute bottom-0 right-0 text-xs text-blue-500 cursor-pointer bg-gradient-to-l from-white pl-2">
            read more...
          </CollapsibleTrigger>
        )}
      </div>
      
      <CollapsibleContent>
        <ScrollArea className="h-36 mt-1">
          <p className="text-sm text-gray-700 pr-3">{text}</p>
        </ScrollArea>
        <div className="text-right mt-1">
          <CollapsibleTrigger className="text-xs text-blue-500 cursor-pointer">
            show less
          </CollapsibleTrigger>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableDescription;
