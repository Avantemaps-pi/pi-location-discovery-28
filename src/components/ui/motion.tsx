
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Motion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    transition?: Record<string, any>;
    whileHover?: Record<string, any>;
    whileTap?: Record<string, any>;
    whileFocus?: Record<string, any>;
    whileInView?: Record<string, any>;
  }
>(
  (
    {
      className,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      whileFocus,
      whileInView,
      ...props
    },
    ref
  ) => {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
      setIsClient(true);
    }, []);

    const style = React.useMemo(() => {
      if (!isClient) {
        return {};
      }

      let styles: Record<string, any> = { ...initial };

      if (animate) {
        styles = { ...styles, ...animate };
      }

      if (transition) {
        const { duration } = transition;
        styles.transition = `all ${duration || 0.3}s ease`;
      }

      return styles;
    }, [isClient, initial, animate, transition]);

    const handleMouseEnter = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isClient) return;

        const target = e.currentTarget;
        if (whileHover) {
          Object.entries(whileHover).forEach(([key, value]) => {
            if (key === "scale" || key === "x" || key === "y") {
              target.style.transform = `${target.style.transform || ""} ${key}(${value})`.trim();
            } else {
              (target.style as any)[key] = value;
            }
          });
        }
      },
      [isClient, whileHover]
    );

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isClient) return;

        const target = e.currentTarget;
        if (whileHover) {
          // Reset to animate state
          Object.keys(whileHover).forEach((key) => {
            if (key === "scale" || key === "x" || key === "y") {
              target.style.transform = animate?.transform || "";
            } else {
              (target.style as any)[key] = animate?.[key] || "";
            }
          });
        }
      },
      [isClient, whileHover, animate]
    );

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={style}
        onMouseEnter={whileHover ? handleMouseEnter : undefined}
        onMouseLeave={whileHover ? handleMouseLeave : undefined}
        {...props}
      />
    );
  }
);

Motion.displayName = "Motion";

export { Motion };
export const motion = {
  div: Motion,
};
