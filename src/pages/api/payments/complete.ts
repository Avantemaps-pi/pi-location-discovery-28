
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
      return res.status(400).json({ error: 'Payment ID and transaction ID are required' });
    }

    console.log('Completing payment:', paymentId, 'with transaction:', txid);
    
    // Use the RPC function with any type to avoid TypeScript errors
    const { data: paymentData, error: dbError } = await supabase
      .rpc('get_payment_by_id', { 
        p_payment_id: paymentId 
      } as any);
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to retrieve payment' });
    }
    
    if (!paymentData) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // In production, you would fetch a server-side access token here.
    // For now, we'll assume the Pi access token is sent from the client
    // NOTE: In a real production app, you should NEVER accept tokens from the client.
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
      console.error('Pi API error:', errorData);
      
      // Update payment status using RPC with any type to avoid TypeScript errors
      await supabase.rpc('update_payment_status', {
        p_payment_id: paymentId,
        p_status: 'completion_failed',
        p_error_data: errorData
      } as any);
      
      return res.status(completeRes.status).json({ 
        error: 'Failed to complete payment with Pi Network', 
        details: errorData 
      });
    }

    const completeData = await completeRes.json();
    
    // Update payment in database with completion status
    await supabase.rpc('update_payment_completion', {
      p_payment_id: paymentId,
      p_status: 'completed',
      p_transaction_id: txid,
      p_completion_data: completeData
    } as any);

    // Credit the user account or deliver the product here
    // This implementation depends on your business logic

    // Update subscription if this was a subscription payment
    if (paymentData.metadata && paymentData.metadata.subscription) {
      const { userId, tier } = paymentData.metadata.subscription;
      
      // Update user subscription in database
      await supabase.rpc('update_user_subscription', {
        p_user_id: userId,
        p_tier: tier,
        p_payment_id: paymentId
      } as any);
    }

    return res.status(200).json({ success: true, data: completeData });
    
  } catch (error) {
    console.error('Server error in payment completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
