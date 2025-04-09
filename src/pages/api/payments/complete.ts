
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

// Pi Network API base URL
const PI_API_URL = 'https://api.minepi.com';

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
    
    // Update payment in our database
    const { data: paymentData, error: dbError } = await (supabase
      .from('pi_payments' as any)
      .update({ 
        txid: txid,
        status: 'completing' 
      })
      .eq('payment_id', paymentId)
      .select()
      .single() as any);
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to update payment' });
    }

    // In production, you would fetch a server-side access token here
    // For now, we'll assume the Pi access token is sent from the client
    // NOTE: In a real production app, you should NEVER accept tokens from the client
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
      
      // Update payment status in database
      await (supabase
        .from('pi_payments' as any)
        .update({ status: 'completion_failed', error_data: errorData })
        .eq('payment_id', paymentId) as any);
        
      return res.status(completeRes.status).json({ 
        error: 'Failed to complete payment with Pi Network', 
        details: errorData 
      });
    }

    const completeData = await completeRes.json();
    
    // Update payment status in database
    await (supabase
      .from('pi_payments' as any)
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        pi_completion_data: completeData
      })
      .eq('payment_id', paymentId) as any);

    // Update user subscription status based on payment metadata
    try {
      // This needs to be handled safely with proper type checking
      const paymentInfo = paymentData as any;
      if (paymentInfo?.pi_payment_data?.metadata?.subscriptionTier) {
        const { data: userData, error: userError } = await (supabase
          .from('users')
          .update({
            subscription: paymentInfo.pi_payment_data.metadata.subscriptionTier,
            subscription_updated_at: new Date().toISOString()
          })
          .eq('id', paymentInfo.user_id)
          .select() as any);
        
        if (userError) {
          console.error('Error updating user subscription:', userError);
        }
      }
    } catch (error) {
      console.error('Error processing subscription update:', error);
      // Continue with payment completion even if subscription update fails
    }

    return res.status(200).json({ success: true, data: completeData });
    
  } catch (error) {
    console.error('Server error in payment completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
