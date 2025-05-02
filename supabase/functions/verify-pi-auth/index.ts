
// Supabase Edge Function to verify Pi Network authentication
// and create a Supabase session

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  try {
    // Get request body
    const body = await req.json();
    const { accessToken, piUid, username } = body;
    
    if (!accessToken || !piUid || !username) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase client
    const supabase = createSupabaseClient();
    
    // Verify Pi Network accessToken with Pi Platform API
    // For this to work fully, you'd need to have Pi API Key secret configured
    const piAuthVerified = await verifyPiAuth(accessToken);
    
    if (!piAuthVerified) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired Pi Network token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get or create user in Supabase
    const { user, error } = await getOrCreateUser(supabase, piUid, username);
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: error || 'Failed to process user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a custom session for the user
    // This is a simplified version - in production you'd want to set proper expiration, etc.
    const session = await createCustomSession(supabase, user.id);
    
    // Return the session data
    return new Response(
      JSON.stringify({ success: true, session }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Verify Pi Network token with Pi Platform API
async function verifyPiAuth(accessToken: string): Promise<boolean> {
  try {
    // In a production environment, you would make a call to Pi Platform API
    // This would use the PI_API_KEY from your secrets
    // Below is a placeholder for how this would work
    
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Pi API error:', await response.text());
      return false;
    }
    
    const data = await response.json();
    return !!data.uid; // If we got a user ID, the token is valid
    
  } catch (error) {
    console.error('Error verifying Pi auth:', error);
    return false;
  }
}

// Get or create user in Supabase
async function getOrCreateUser(
  supabase: SupabaseClient,
  piUid: string,
  username: string
): Promise<{ user: any; error: string | null }> {
  try {
    // Check if user exists
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('id', piUid)
      .maybeSingle();
    
    if (queryError) throw queryError;
    
    if (existingUser) {
      // Update existing user if needed
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ username })
        .eq('id', piUid)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      return { user: updatedUser, error: null };
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: piUid,
          username,
          email: `${username}@placeholder.com`, // Since Pi Network doesn't provide email
          subscription: 'individual',
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return { user: newUser, error: null };
    }
  } catch (error) {
    console.error('Database error:', error);
    return { user: null, error: 'Failed to process user data' };
  }
}

// Create a custom session for the user
async function createCustomSession(supabase: SupabaseClient, userId: string) {
  // Note: In a production environment, you would use proper JWT signing
  // and custom claims to create a secure session
  
  // This is a simplified example - in production you'd want more security
  const { data, error } = await supabase.auth.admin.createUser({
    user_id: userId,
    email: `${userId}@pi-auth.example.com`,
    email_confirm: true,
    app_metadata: {
      provider: 'pi_network',
      pi_authenticated: true
    },
    user_metadata: {
      pi_user_id: userId
    }
  });
  
  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }
  
  return data;
}
