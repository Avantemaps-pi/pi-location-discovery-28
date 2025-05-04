
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PI_MAINNET_API_KEY = Deno.env.get('PI_MAINNET_API_KEY');

async function checkPiMainnetStatus() {
  if (!PI_MAINNET_API_KEY) {
    throw new Error('PI_MAINNET_API_KEY is not configured');
  }

  try {
    const response = await fetch('https://api.minepi.com/v2/status', {
      method: 'GET',
      headers: {
        'Authorization': `Key ${PI_MAINNET_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`PI Mainnet API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking Pi Mainnet status:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const status = await checkPiMainnetStatus();
    
    return new Response(JSON.stringify(status), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
