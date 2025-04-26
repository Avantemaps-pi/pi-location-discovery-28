
import { useState, useCallback } from 'react';

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const nextTab = useCallback(() => {
    setActiveTab((current) => Math.min(current + 1, 3));
  }, []);

  const prevTab = useCallback(() => {
    setActiveTab((current) => Math.max(current - 1, 0));
  }, []);

  return {
    activeTab,
    setActiveTab,
    nextTab,
    prevTab,
  };
};

