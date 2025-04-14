
import { useState, useEffect } from 'react';

type CoinGeckoResponse = {
  tether: {
    usd: number;
  };
};

export const useUsdtPrice = () => {
  const [usdtPrice, setUsdtPrice] = useState<number>(1); // Default to 1 USD
  const [lastCheckedPrice, setLastCheckedPrice] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsdtPrice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch USDT price');
      }
      
      const data: CoinGeckoResponse = await response.json();
      const currentPrice = data.tether.usd;
      
      // Only update if price has changed by $0.25 or more
      if (Math.abs(currentPrice - lastCheckedPrice) >= 0.25) {
        setUsdtPrice(currentPrice);
        setLastCheckedPrice(currentPrice);
        console.log('USDT price updated:', currentPrice);
      }
      
    } catch (err) {
      console.error('Error fetching USDT price:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on component mount
    fetchUsdtPrice();
    
    // Then fetch every 5 minutes
    const intervalId = setInterval(fetchUsdtPrice, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [lastCheckedPrice]);

  // Convert USD price to Pi using the fixed exchange rate (1 Pi = $10)
  const convertUsdToPi = (usdPrice: number): number => {
    return usdPrice / 10;
  };

  return {
    usdtPrice,
    convertUsdToPi,
    isLoading,
    error,
    refreshPrice: fetchUsdtPrice
  };
};
