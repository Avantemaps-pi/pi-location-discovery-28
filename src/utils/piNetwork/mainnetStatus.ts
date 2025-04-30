
import { supabase } from '@/integrations/supabase/client';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

export const checkPiMainnetStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('pi-mainnet-check', {
      body: {}
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching Pi Mainnet status:', error);
    throw error;
  }
};
