
import { supabase } from '@/integrations/supabase/client';

// Pi Network API base URL
const PI_API_URL = 'https://api.minepi.com';

// Define NextApiRequest and NextApiResponse manually since we can't modify the Next.js types
type NextApiRequest = {
  method?: string;
  body: any;
  headers: {
    [key: string]: string | string[] | undefined;
    authorization?: string;
  };
};

type NextApiResponse = {
  status: (code: number) => NextApiResponse;
  json: (data: any) => void;
  end: () => void;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
      return res.status(400).json({ 
        error: 'Payment ID and transaction ID are required' 
      });
    }

    // Use stored procedure to find the payment
    const { data: paymentExists, error: findError } = await supabase
      .rpc('find_payment', { p_payment_id: paymentId });

    if (findError || !paymentExists) {
      console.error('Error finding payment:', findError);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // In production, you should use a server-side access token
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    // Call Pi Platform API to complete the payment
    const completeRes = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    if (!completeRes.ok) {
      const errorData = await completeRes.json();
      console.error('Pi API error (completion):', errorData);
      
      // Update payment status using RPC
      await supabase.rpc('update_payment_status', {
        p_payment_id: paymentId, 
        p_status: 'completion_failed',
        p_error_data: errorData
      });
      
      return res.status(completeRes.status).json({ 
        error: 'Failed to complete payment with Pi Network', 
        details: errorData 
      });
    }

    const completeData = await completeRes.json();
    
    // Update payment status using RPC
    await supabase.rpc('update_payment_completion', {
      p_payment_id: paymentId,
      p_status: 'completed',
      p_txid: txid,
      p_pi_payment_data: completeData
    });

    // After successful completion, check if this is a subscription payment
    // and update the user's subscription if needed
    try {
      const paymentResult = await supabase.rpc('get_payment', { p_payment_id: paymentId });
      
      if (paymentResult.data && 
          paymentResult.data.metadata && 
          paymentResult.data.metadata.type === 'subscription') {
        
        // Update the user's subscription tier
        await supabase.rpc('update_user_subscription', { 
          p_user_id: paymentResult.data.user_uid,
          p_subscription_tier: paymentResult.data.metadata.tier,
          p_payment_id: paymentId
        });
      }
    } catch (subError) {
      console.error('Error updating subscription:', subError);
      // Don't fail the API call if subscription update fails
      // The payment was still completed successfully
    }

    return res.status(200).json({ success: true, data: completeData });
    
  } catch (error) {
    console.error('Server error in payment completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
