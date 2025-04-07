
-- Function to insert a payment record
CREATE OR REPLACE FUNCTION public.insert_payment(p_payment_id TEXT, p_status TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  INSERT INTO public.pi_payments(payment_id, status)
  VALUES (p_payment_id, p_status)
  RETURNING to_jsonb(pi_payments.*) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update payment status
CREATE OR REPLACE FUNCTION public.update_payment_status(p_payment_id TEXT, p_status TEXT, p_error_data JSONB DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE public.pi_payments
  SET status = p_status, 
      error_data = p_error_data,
      updated_at = NOW()
  WHERE payment_id = p_payment_id
  RETURNING to_jsonb(pi_payments.*) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update payment with approval data
CREATE OR REPLACE FUNCTION public.update_payment_approval(p_payment_id TEXT, p_status TEXT, p_pi_payment_data JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE public.pi_payments
  SET status = p_status, 
      pi_payment_data = p_pi_payment_data,
      updated_at = NOW()
  WHERE payment_id = p_payment_id
  RETURNING to_jsonb(pi_payments.*) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update payment txid
CREATE OR REPLACE FUNCTION public.update_payment_txid(p_payment_id TEXT, p_txid TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE public.pi_payments
  SET txid = p_txid,
      updated_at = NOW()
  WHERE payment_id = p_payment_id
  RETURNING to_jsonb(pi_payments.*) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update payment completion data
CREATE OR REPLACE FUNCTION public.update_payment_completion(p_payment_id TEXT, p_status TEXT, p_pi_completion_data JSONB, p_completed_at TIMESTAMP WITH TIME ZONE)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE public.pi_payments
  SET status = p_status, 
      pi_completion_data = p_pi_completion_data,
      completed_at = p_completed_at,
      updated_at = NOW()
  WHERE payment_id = p_payment_id
  RETURNING to_jsonb(pi_payments.*) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get payment by id
CREATE OR REPLACE FUNCTION public.get_payment_by_id(p_payment_id TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT to_jsonb(pi_payments.*)
  INTO result
  FROM public.pi_payments
  WHERE payment_id = p_payment_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update user subscription
CREATE OR REPLACE FUNCTION public.update_user_subscription(p_user_id TEXT, p_subscription TEXT, p_updated_at TIMESTAMP WITH TIME ZONE)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE public.users
  SET subscription = p_subscription,
      subscription_updated_at = p_updated_at
  WHERE id = p_user_id
  RETURNING to_jsonb(users.*) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
