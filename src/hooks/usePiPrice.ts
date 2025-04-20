
import { useState, useEffect } from 'react';

export const usePiPrice = () => {
  const [piPrice, setPiPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPiPrice = async () => {
      try {
        // For now use a mock price, later integrate with OKX API
        const mockPiPrice = 5; // $5 USD per Pi
        setPiPrice(mockPiPrice);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Pi price');
        console.error('Error fetching Pi price:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPiPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchPiPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertUsdToPi = (usdAmount: number) => {
    if (!piPrice) return null;
    return (usdAmount / piPrice).toFixed(2);
  };

  return { piPrice, isLoading, error, convertUsdToPi };
};
