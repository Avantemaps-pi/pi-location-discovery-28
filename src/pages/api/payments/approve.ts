
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

// Pi Network API base URL
const PI_API_URL = 'https://api.minepi.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    console.log('Approving payment:', paymentId);
    
    // Store the payment in our database first
    const { data: paymentData, error: dbError } = await supabase
      .from('pi_payments')
      .insert([{ payment_id: paymentId, status: 'pending' }])
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to store payment' });
    }

    // In production, you would fetch a server-side access token here.
    // For now, we'll assume the Pi access token is sent from the client
    // NOTE: In a real production app, you should NEVER accept tokens from the client.
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    // Call Pi Platform API to approve the payment
    const approveRes = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!approveRes.ok) {
      const errorData = await approveRes.json();
      console.error('Pi API error:', errorData);
      
      // Update payment status in database
      await supabase
        .from('pi_payments')
        .update({ status: 'approval_failed', error_data: errorData })
        .eq('payment_id', paymentId);
        
      return res.status(approveRes.status).json({ 
        error: 'Failed to approve payment with Pi Network', 
        details: errorData 
      });
    }

    const approveData = await approveRes.json();
    
    // Update payment status in database
    await supabase
      .from('pi_payments')
      .update({ 
        status: 'approved',
        pi_payment_data: approveData
      })
      .eq('payment_id', paymentId);

    return res.status(200).json({ success: true, data: approveData });
    
  } catch (error) {
    console.error('Server error in payment approval:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
