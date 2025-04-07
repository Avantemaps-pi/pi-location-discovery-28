
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
    
    // Update payment record with txid
    const { data: paymentData, error: dbError } = await supabase.rpc('update_payment_txid', {
      p_payment_id: paymentId,
      p_txid: txid
    });
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to update payment' });
    }

    // In production, you would fetch a server-side access token here.
    // For now, we'll assume the Pi access token is sent from the client
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
      
      // Update payment status
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
    
    // Update payment status
    await supabase.rpc('update_payment_completion', {
      p_payment_id: paymentId,
      p_status: 'completed',
      p_pi_completion_data: completeData,
      p_completed_at: new Date().toISOString()
    });

    // Now let's get the payment data to extract user information
    const { data: payment, error: fetchError } = await supabase.rpc('get_payment_by_id', {
      p_payment_id: paymentId
    });
    
    if (fetchError || !payment) {
      console.error('Error fetching payment:', fetchError);
    } else {
      // Update user's subscription based on payment metadata
      try {
        const paymentDetails = payment.pi_payment_data;
        
        if (paymentDetails && paymentDetails.metadata && 
            paymentDetails.metadata.subscriptionTier) {
          
          const userId = payment.user_id;
          const tier = paymentDetails.metadata.subscriptionTier;
          
          if (userId) {
            // Update the user's subscription tier
            await supabase.rpc('update_user_subscription', {
              p_user_id: userId,
              p_subscription: tier,
              p_updated_at: new Date().toISOString()
            });
            
            console.log(`Updated user ${userId} subscription to ${tier}`);
          }
        }
      } catch (subError) {
        console.error('Error updating subscription:', subError);
        // Don't fail the request if subscription update fails
      }
    }

    return res.status(200).json({ success: true, data: completeData });
    
  } catch (error) {
    console.error('Server error in payment completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
