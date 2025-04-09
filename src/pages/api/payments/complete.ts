
import { supabase } from '@/integrations/supabase/client';

// Express-like type definitions
interface Request {
  method?: string;
  body?: any;
  headers?: any;
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => Response;
}

// Pi Network API base URL
const PI_API_URL = 'https://api.minepi.com';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, txid } = req.body;
    
    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Payment ID and transaction ID are required' });
    }

    console.log('Completing payment:', paymentId, 'with transaction:', txid);
    
    // Update the payment status in our database
    const { data: paymentData, error: dbError } = await (supabase
      .from('pi_payments' as any)
      .update({ 
        status: 'completed',
        transaction_id: txid,
        completed_at: new Date().toISOString()
      })
      .eq('payment_id', paymentId)
      .select()
      .single() as any);
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }

    if (!paymentData) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // In a real integration, we would fetch a server-side access token here
    // For this demo version, we'll accept a token from the client
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
        .update({ 
          status: 'completion_failed', 
          error_data: errorData
        })
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
        pi_payment_data: completeData
      })
      .eq('payment_id', paymentId) as any);

    // In a real application, we would also update the user's subscription tier here
    // This would involve updating the user's record in the database

    return res.status(200).json({ 
      success: true, 
      data: completeData,
      message: 'Payment completed successfully'
    });
    
  } catch (error) {
    console.error('Server error in payment completion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
