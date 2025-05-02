
import { supabase } from '@/integrations/supabase/client';

/**
 * Verifies Pi Network authentication with our backend and establishes a Supabase session
 */
export const verifyPiAuthWithBackend = async (
  accessToken: string,
  piUid: string,
  username: string
): Promise<boolean> => {
  try {
    // Call our edge function to verify the Pi auth token and create a session
    const { data, error } = await supabase.functions.invoke('verify-pi-auth', {
      body: JSON.stringify({
        accessToken,
        piUid,
        username
      })
    });
    
    if (error) {
      console.error('Error verifying Pi auth:', error);
      return false;
    }
    
    if (!data.success || !data.session) {
      console.error('Failed to create session:', data);
      return false;
    }
    
    // Store session in local storage (simplified approach)
    // In a production app, you'd use Supabase's auth.setSession() or similar
    localStorage.setItem('avante_maps_auth', JSON.stringify({
      uid: piUid,
      username: username,
      accessToken: accessToken,
      lastAuthenticated: Date.now(),
      subscriptionTier: 'individual'
    }));
    
    return true;
  } catch (error) {
    console.error('Error in Pi auth verification:', error);
    return false;
  }
};
